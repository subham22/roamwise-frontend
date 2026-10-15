import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MapsLoaderService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private loadPromise?: Promise<void>;

  load(): Promise<void> {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    // Server: never resolve, so the placeholder stays and <google-map> never renders there
    if (!isPlatformBrowser(this.platformId)) {
      this.loadPromise = new Promise<void>(() => {});
      return this.loadPromise;
    }

    this.loadPromise = new Promise<void>((resolve, reject) => {
      const script = this.document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsKey}&loading=async`;
      script.async = true;

      // With loading=async, onload only means the bootstrap is ready; load the libraries we use
      script.onload = () =>
        Promise.all([
          google.maps.importLibrary('maps'),
          google.maps.importLibrary('marker'),
        ]).then(() => resolve(), reject);

      script.onerror = () => {
        this.loadPromise = undefined; // allow a retry on the next load() call
        script.remove();
        reject(new Error('Failed to load Google Maps JavaScript API'));
      };

      this.document.head.appendChild(script);
    });

    return this.loadPromise;
  }
}