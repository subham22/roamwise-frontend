import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TripDraft } from '../models/trip.interface';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class TripDraftService {
    private platformId = inject(PLATFORM_ID);

    saveDraft(draft: TripDraft) {
        if (isPlatformBrowser(this.platformId)) {
            sessionStorage.setItem('tripDraft', JSON.stringify(draft));
        }
    }

    getDraft(): TripDraft | null{
        if (!isPlatformBrowser(this.platformId)) return null;
        const raw = sessionStorage.getItem('tripDraft');
        return raw ? JSON.parse(raw): null;
    }

    clearDraft(): void {
        if (isPlatformBrowser(this.platformId)) {
            sessionStorage.removeItem('tripDraft');
        }
    }
}
