import { inject, Injectable } from '@angular/core';
import { CreateTripRequest, TripResponse } from '../models/trip.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class TripService {
    private http = inject(HttpClient);

    private static readonly PENDING_GUIDE_KEY = 'pendingGuideCopy';

    /** Copies a published guide into the current user's trips; emits the new trip id. */
    createTripFromGuide(slug: string): Observable<number> {
        return this.http.post<number>(`/trips/from-guide/${encodeURIComponent(slug)}`, {});
    }

    /** Remembers a guide the visitor wanted to customize, so it can be copied right after login. */
    setPendingGuideCopy(slug: string): void {
        localStorage.setItem(TripService.PENDING_GUIDE_KEY, slug);
    }

    takePendingGuideCopy(): string | null {
        const slug = localStorage.getItem(TripService.PENDING_GUIDE_KEY);
        localStorage.removeItem(TripService.PENDING_GUIDE_KEY);
        return slug;
    }

    createTrip(request: CreateTripRequest): Observable<TripResponse> {
        return this.http.post<TripResponse>('/trips', request);
    }

    proposeReplan(
        tripId: number,
        criteria: any,
    ): Observable<{ id: number; diff: string[] }> {
        return this.http.post<{ id: number; diff: string[] }>(
            `/trips/${tripId}/replan`, criteria,
        );
    }

    confirmReplan(proposalId: number): Observable<void> {
        return this.http.post<void>(`/trips/replan/${proposalId}/confirm`, {});
    }

    exportPdf(tripId: number): Observable<Blob> {
        return this.http.get(`/trips/${tripId}/export/pdf`, {
            responseType: 'blob',
        });
    }

    exportIcs(tripId: number): Observable<Blob> {
        return this.http.get(`/trips/${tripId}/export/ics`, {
            responseType: 'blob',
        });
    }

    generateTrip(request: CreateTripRequest): Observable<number> {
        return this.http.post<number>('/trips/generate', request);
    }

    shareTrip(
        tripId: number,
        recipientEmail: string | null,
    ): Observable<{ shareUrl: string }> {
        return this.http.post<{ shareUrl: string }>(`/trips/${tripId}/share`, {
            recipientEmail,
        });
    }
}
