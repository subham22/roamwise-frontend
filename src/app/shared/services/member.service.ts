import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TripMember, TripRole } from '../models/trip.interface';

/** Group trips: people on a trip and their votes on activities. */
@Injectable({ providedIn: 'root' })
export class MemberService {
    private http = inject(HttpClient);

    invite(tripId: number, email: string, role: Exclude<TripRole, 'OWNER'>): Observable<TripMember> {
        return this.http.post<TripMember>(`/trips/${tripId}/members`, { email, role });
    }

    remove(tripId: number, memberId: number): Observable<void> {
        return this.http.delete<void>(`/trips/${tripId}/members/${memberId}`);
    }

    vote(activityId: number, value: -1 | 0 | 1): Observable<void> {
        return this.http.post<void>(`/activities/${activityId}/vote`, { value });
    }
}
