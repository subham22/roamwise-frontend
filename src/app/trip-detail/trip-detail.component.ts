import { httpResource } from '@angular/common/http';
import {
    Component,
    computed,
    inject,
    input,
    OnInit,
    signal,
} from '@angular/core';
import { TripDetail, TripDay } from '../shared/models/trip.interface';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { DayService } from '../shared/services/day.service';
import { ActivityService } from '../shared/services/activity.service';
import { ActivityResponse } from '../shared/models/day.interface';

@Component({
    selector: 'app-trip-detail',
    imports: [ReactiveFormsModule],
    templateUrl: './trip-detail.component.html',
    styleUrl: './trip-detail.component.css',
})
export class TripDetailComponent implements OnInit {
    private fb = inject(FormBuilder);
    private dayService = inject(DayService);
    private activityService = inject(ActivityService);

    tripId = input<string>('');
    showAddDayForm = signal(false);
    openActivityFormForDay = signal<number | null>(null);
    tripResource = httpResource<TripDetail>(() => '/trips/' + this.tripId());

    createDayForm!: FormGroup;
    createActivityForm!: FormGroup;

    editingDayId = signal<number | null>(null);
    editingActivityId = signal<number | null>(null);

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
            : this.dayService.createDay(this.tripId(), this.createDayForm.value);

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
            ? this.activityService.updateActivity(id, this.createActivityForm.value)
            : this.activityService.createActivity(dayId, this.createActivityForm.value);

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
}