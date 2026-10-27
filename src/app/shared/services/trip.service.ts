import { inject, Injectable } from '@angular/core';
import { CreateTripRequest, TripResponse } from '../models/trip.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class TripService {
    private http = inject(HttpClient);

    private static readonly PENDING_COPY_KEY = 'pendingCopy';

    /** Copies a published guide into the current user's trips; emits the new trip id. */
    createTripFromGuide(slug: string): Observable<number> {
        return this.http.post<number>(`/trips/from-guide/${encodeURIComponent(slug)}`, {});
    }

    /** Copies a trip someone shared into the current user's trips; emits the new trip id. */
    copySharedTrip(shareToken: string): Observable<number> {
        return this.http.post<number>(`/trips/copy-shared/${encodeURIComponent(shareToken)}`, {});
    }

    /** Remembers what a logged-out visitor wanted to copy, so login can finish it. */
    setPendingCopy(kind: 'guide' | 'shared', id: string): void {
        localStorage.setItem(TripService.PENDING_COPY_KEY, JSON.stringify({ kind, id }));
    }

    /** Runs (and clears) a pending copy, or returns null when there is none. */
    takePendingCopy(): Observable<number> | null {
        const raw = localStorage.getItem(TripService.PENDING_COPY_KEY);
        localStorage.removeItem(TripService.PENDING_COPY_KEY);
        if (!raw) return null;
        try {
            const { kind, id } = JSON.parse(raw) as { kind: string; id: string };
            if (kind === 'guide') return this.createTripFromGuide(id);
            if (kind === 'shared') return this.copySharedTrip(id);
        } catch {
            // ignore a malformed entry
        }
        return null;
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

    /** Free-text AI edit; returns a proposal to preview, applied with confirmReplan(). */
    chatEdit(tripId: number, message: string): Observable<{ id: number; diff: string[] }> {
        return this.http.post<{ id: number; diff: string[] }>(`/trips/${tripId}/chat-edit`, { message });
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
