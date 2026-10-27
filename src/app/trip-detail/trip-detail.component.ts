import { httpResource } from '@angular/common/http';
import {
    Component,
    computed,
    effect,
    inject,
    input,
    OnInit,
    signal,
} from '@angular/core';
import {
    TripDetail,
    TripDay,
    TripActivity,
} from '../shared/models/trip.interface';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    CdkDrag,
    CdkDragDrop,
    CdkDropList,
    moveItemInArray,
} from '@angular/cdk/drag-drop';
import { DayService } from '../shared/services/day.service';
import { ActivityService } from '../shared/services/activity.service';
import { ActivityResponse } from '../shared/models/day.interface';
import { DayWeatherComponent } from '../day-weather/day-weather.component';
import { environment } from '../../environments/environment';
import { DayMapComponent } from '../shared/components/day-map/day-map.component';
import { TripService } from '../shared/services/trip.service';
import { FeasibilityIssue } from '../shared/models/activity.interface';
import { SeoService } from '../shared/services/seo.service';
import { TripMembersComponent } from '../shared/components/trip-members/trip-members.component';
import { ActivityVoteComponent } from '../shared/components/activity-vote/activity-vote.component';
import { MemberService } from '../shared/services/member.service';
import { VoteSummary } from '../shared/models/trip.interface';
import { AnalyticsService } from '../shared/services/analytics.service';

@Component({
    selector: 'app-trip-detail',
    imports: [TripMembersComponent, ActivityVoteComponent, 
        ReactiveFormsModule,
        DayWeatherComponent,
        CdkDrag,
        CdkDropList,
        DayMapComponent,
    ],
    templateUrl: './trip-detail.component.html',
    styleUrl: './trip-detail.component.css',
})
export class TripDetailComponent implements OnInit {
    private fb = inject(FormBuilder);
    private dayService = inject(DayService);
    private activityService = inject(ActivityService);
    private tripService = inject(TripService);

    readonly environment = environment;

    tripId = input<string>('');
    showAddDayForm = signal(false);
    openActivityFormForDay = signal<number | null>(null);
    tripResource = httpResource<TripDetail>(() => '/trips/' + this.tripId());

    // group trips: role decides which controls show (the backend enforces the same rules)
    private memberService = inject(MemberService);
    myRole = computed(() => (this.tripResource.hasValue() ? this.tripResource.value().myRole : undefined) ?? 'OWNER');
    canEdit = computed(() => this.myRole() !== 'VIEWER');
    isOwner = computed(() => this.myRole() === 'OWNER');
    isGroupTrip = computed(() => this.tripResource.hasValue() && (this.tripResource.value().memberCount ?? 0) > 0);
    showPeople = signal(false);
    votes = httpResource<Record<number, VoteSummary>>(() =>
        this.isGroupTrip() ? `/trips/${this.tripId()}/votes` : undefined,
    );

    voteFor(activityId: number): VoteSummary | undefined {
        return this.votes.hasValue() ? this.votes.value()[activityId] : undefined;
    }

    onVote(activityId: number, value: -1 | 0 | 1) {
        this.memberService.vote(activityId, value).subscribe({ next: () => this.votes.reload() });
    }

    onPeopleChanged() {
        this.tripResource.reload();
        this.votes.reload();
    }
    createDayForm!: FormGroup;
    createActivityForm!: FormGroup;

    editingDayId = signal<number | null>(null);
    editingActivityId = signal<number | null>(null);

    selectedPhotoUrl = signal<string | null>(null);

    showShareModal = signal(false);
    shareEmail = signal('');
    shareUrl = signal<string | null>(null);
    isSharing = signal(false);

    showReplanModal = signal(false);
    budgetDelta = signal(0);
    interest = signal('');
    replanDiff = signal<string[] | null>(null);
    replanProposalId = signal<number | null>(null);
    isReplanning = signal(false);

    feasibilityByDay = signal<Map<number, FeasibilityIssue[]>>(new Map());

    private seo = inject(SeoService);
    private analytics = inject(AnalyticsService);

    constructor() {
        effect(() => {
            const trip = this.tripResource.value();
            if (trip) {
                trip.days.forEach((day) => this.loadFeasibilityForDay(day.id));
                this.seo.update({
                    title: 'Trip details',
                    description: `Trip to ${trip.destination} from ${trip.origin}`,
                    path: `/app/trips/${trip.tripId}`,
                    noindex: true,
                })
            }
        });
    }

    // "Edit with AI": free-text change -> preview diff -> apply (reuses the replan proposal flow)
    showChatModal = signal(false);
    chatMessage = signal('');
    chatDiff = signal<string[] | null>(null);
    chatProposalId = signal<number | null>(null);
    isChatting = signal(false);
    isApplyingChat = signal(false);
    readonly chatSuggestions = [
        'Make day 2 more relaxed',
        'Add more local food spots',
        'Swap one museum for something outdoors',
        'Start every day after 9 am',
    ];

    openChatModal() {
        this.showChatModal.set(true);
        this.chatDiff.set(null);
        this.chatProposalId.set(null);
    }

    onChatPropose() {
        const message = this.chatMessage().trim();
        if (!message || this.isChatting()) return;
        this.isChatting.set(true);
        this.analytics.event('trip_chat_edit', { length: message.length });
        this.tripService.chatEdit(Number(this.tripId()), message).subscribe({
            next: (res) => {
                this.chatDiff.set(res.diff);
                this.chatProposalId.set(res.id);
                this.isChatting.set(false);
            },
            error: () => this.isChatting.set(false),
        });
    }

    onChatApply() {
        const id = this.chatProposalId();
        if (!id) return;
        this.isApplyingChat.set(true);
        this.tripService.confirmReplan(id).subscribe({
            next: () => {
                this.isApplyingChat.set(false);
                this.showChatModal.set(false);
                this.chatMessage.set('');
                this.chatDiff.set(null);
                this.analytics.event('trip_chat_edit_applied');
                this.tripResource.reload();
            },
            error: () => this.isApplyingChat.set(false),
        });
    }

    onChatRetry() {
        this.chatDiff.set(null);
        this.chatProposalId.set(null);
    }

    openReplanModal() {
        this.showReplanModal.set(true);
        this.replanDiff.set(null);
    }

    onPropose() {
        this.isReplanning.set(true);
        this.tripService
            .proposeReplan(Number(this.tripId()), {
                budgetDelta: this.budgetDelta(),
                interest: this.interest()
            })
            .subscribe({
                next: (res) => {
                    this.replanDiff.set(res.diff);
                    this.replanProposalId.set(res.id);
                    this.isReplanning.set(false);
                },
                error: () => this.isReplanning.set(false),
            });
    }

    onConfirmReplan() {
        const id = this.replanProposalId();
        if (!id) return;
        this.tripService.confirmReplan(id).subscribe({
            next: () => {
                this.showReplanModal.set(false);
                this.interest.set('');
                this.budgetDelta.set(0);
                this.tripResource.reload();
            },
        });
    }

    loadFeasibilityForDay(dayId: number) {
        return this.dayService.getDayFeasibility(dayId).subscribe({
            next: (response) => {
                this.feasibilityByDay.update((current) => {
                    const updated = new Map(current);
                    updated.set(dayId, response);
                    return updated;
                });
            },
        });
    }

    issuesFor(activityId: number): FeasibilityIssue[] {
        const allIssues = Array.from(this.feasibilityByDay().values()).flat();
        return allIssues.filter((i) => i.activityId === activityId);
    }

    openPhoto(photoReference: string) {
        this.selectedPhotoUrl.set(
            environment.apiUrl +
                '/places/photo?photoReference=' +
                photoReference,
        );
    }

    closePhoto() {
        this.selectedPhotoUrl.set(null);
    }

    openShareModal() {
        this.showShareModal.set(true);
        this.shareUrl.set(null);
    }

    onShare() {
        this.isSharing.set(true);
        const email = this.shareEmail().trim() || null;
        this.tripService.shareTrip(Number(this.tripId()), email).subscribe({
            next: (res) => {
                this.shareUrl.set(res.shareUrl);
                this.isSharing.set(false);
                this.analytics.event('trip_share', { by_email: !!email });
            },
        });
    }

    copyShareLink() {
        navigator.clipboard.writeText(this.shareUrl()!);
        this.analytics.event('trip_share_link', { channel: 'copy' });
    }

    whatsAppShareUrl(): string {
        return 'https://wa.me/?text=' + encodeURIComponent('Check out my trip plan on Roamwise: ' + this.shareUrl());
    }

    trackWhatsAppShare() {
        this.analytics.event('trip_share_link', { channel: 'whatsapp' });
    }

    ngOnInit(): void {
        this.createDayForm = this.fb.group({
            dayNo: new FormControl('', [Validators.required]),
            dayDate: new FormControl('', [Validators.required]),
        });

        this.createActivityForm = this.fb.group({
            name: new FormControl('', [Validators.required]),
            startTime: new FormControl('', [Validators.required]),
            endTime: new FormControl('', [Validators.required]),
            sequence: new FormControl<number>(0, [Validators.required]),
            notes: new FormControl(''),
        });
    }

    isPastTrip = computed(() => {
        const trip = this.tripResource.value();
        if (!trip) return false;
        return new Date(trip.endDate) < new Date();
    });

    onEditDay(day: TripDay) {
        this.editingDayId.set(day.id);
        this.showAddDayForm.set(true);
        this.createDayForm.patchValue({
            dayNo: day.dayNo,
            dayDate: day.dayDate,
        });
    }

    onSaveDay() {
        if (this.createDayForm.invalid) return;
        const id = this.editingDayId();
        const request$ = id
            ? this.dayService.updateDay(id, this.createDayForm.value)
            : this.dayService.createDay(
                  this.tripId(),
                  this.createDayForm.value,
              );

        request$.subscribe({
            next: () => {
                this.tripResource.reload();
                this.showAddDayForm.set(false);
                this.editingDayId.set(null);
                this.createDayForm.reset();
            },
        });
    }

    onDeleteDay(dayId: number) {
        this.dayService.deleteDay(dayId).subscribe({
            next: () => {
                this.tripResource.reload();
            },
        });
    }

    onEditActivity(dayId: number, activity: ActivityResponse) {
        this.editingActivityId.set(activity.id);
        this.openActivityFormForDay.set(dayId);
        this.createActivityForm.patchValue(activity);
    }

    onSaveActivity(dayId: number) {
        if (this.createActivityForm.invalid) return;
        const id = this.editingActivityId();
        const request$ = id
            ? this.activityService.updateActivity(
                  id,
                  this.createActivityForm.value,
              )
            : this.activityService.createActivity(
                  dayId,
                  this.createActivityForm.value,
              );

        request$.subscribe({
            next: () => {
                this.tripResource.reload();
                this.openActivityFormForDay.set(null);
                this.editingActivityId.set(null);
                this.createActivityForm.reset();
            },
        });
    }

    onDeleteActivity(activityId: number) {
        this.activityService.deleteActivity(activityId).subscribe({
            next: () => this.tripResource.reload(),
        });
    }

    sortedActivities(day: TripDay) {
        return day.activities;
    }

    onActivityDrop(event: CdkDragDrop<TripActivity[]>, day: TripDay) {
        const activities = this.sortedActivities(day);
        moveItemInArray(activities, event.previousIndex, event.currentIndex);

        const orderedIds = activities.map((act) => act.id);
        this.activityService.reorderActivities(day.id, orderedIds).subscribe({
            next: (response) => {
                this.tripResource.reload();
            },
        });
    }

    downloadPdf() {
        this.tripService.exportPdf(Number(this.tripId())).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${this.tripResource.value()?.destination ?? 'trip'}.pdf`;
                link.click();
                window.URL.revokeObjectURL(url);
            },
        });
    }

    downloadIcs() {
        this.tripService.exportIcs(Number(this.tripId())).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${this.tripResource.value()?.destination ?? 'trip'}.ics`;
                link.click();
                window.URL.revokeObjectURL(url);
            },
        });
    }
}
