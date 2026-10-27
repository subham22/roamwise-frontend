import { Component, computed, inject, input, output, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Router } from '@angular/router';
import { TripMember, TripRole } from '../../models/trip.interface';
import { MemberService } from '../../services/member.service';
import { AuthService } from '../../services/auth.service';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
    selector: 'app-trip-members',
    templateUrl: './trip-members.component.html',
    styleUrl: './trip-members.component.css',
})
export class TripMembersComponent {
    tripId = input.required<number>();
    isOwner = input(false);
    /** Emitted when membership changed, so the trip page can refresh votes/roles. */
    changed = output<void>();

    private memberService = inject(MemberService);
    private auth = inject(AuthService);
    private router = inject(Router);
    private analytics = inject(AnalyticsService);

    members = httpResource<TripMember[]>(() => `/trips/${this.tripId()}/members`);
    myEmail = computed(() => this.auth.userEmail()?.toLowerCase() ?? '');

    email = signal('');
    role = signal<Exclude<TripRole, 'OWNER'>>('EDITOR');
    inviting = signal(false);
    error = signal('');
    sentTo = signal('');

    roleLabel(role: TripRole): string {
        return role === 'OWNER' ? 'Owner' : role === 'EDITOR' ? 'Can edit' : 'Can view';
    }

    invite(): void {
        const email = this.email().trim();
        if (!email || this.inviting()) return;
        this.inviting.set(true);
        this.error.set('');
        this.sentTo.set('');
        this.memberService.invite(this.tripId(), email, this.role()).subscribe({
            next: () => {
                this.inviting.set(false);
                this.sentTo.set(email);
                this.email.set('');
                this.analytics.event('trip_invite', { role: this.role() });
                this.members.reload();
                this.changed.emit();
            },
            error: (err) => {
                this.inviting.set(false);
                this.error.set(err.error?.message ?? "Couldn't send the invite.");
            },
        });
    }

    remove(member: TripMember): void {
        if (member.id == null) return;
        const leaving = member.email.toLowerCase() === this.myEmail();
        this.memberService.remove(this.tripId(), member.id).subscribe({
            next: () => {
                if (leaving) {
                    this.router.navigate(['/app/dashboard']);
                    return;
                }
                this.members.reload();
                this.changed.emit();
            },
        });
    }
}
