import { isPlatformBrowser } from "@angular/common";
import { DOCUMENT, inject, Injectable, PLATFORM_ID } from "@angular/core";

declare global {
    interface Window {
        dataLayer: Record<string, unknown>[];
    }
}

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {

    platformId = inject(PLATFORM_ID);

    document = inject(DOCUMENT);

    pageView() {
         if (!isPlatformBrowser(this.platformId)) return;
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'virtual_page_view',
            page_location: this.document.location.href,
            page_title: this.document.title
        })
    }
}