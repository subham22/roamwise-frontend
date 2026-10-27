import { Component, effect, HostListener, inject, input, OnInit, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { TripService } from '../shared/services/trip.service';
import { AnalyticsService } from '../shared/services/analytics.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TripDetail } from '../shared/models/trip.interface';
import { environment } from '../../environments/environment';
import { SeoService } from '../shared/services/seo.service';

@Component({
  selector: 'app-shared-trip',
  standalone: true,
  templateUrl: './shared-trip.component.html',
  styleUrl: './shared-trip.component.css',
})
export class SharedTripComponent implements OnInit{

    readonly environment = environment;

    selectedPhotoUrl = signal<string | null>(null);
    private seo = inject(SeoService)
    private auth = inject(AuthService);
    private tripService = inject(TripService);
    private analytics = inject(AnalyticsService);
    private router = inject(Router);

    isLoggedIn = this.auth.isLoggedIn;
    copying = signal(false);
    copyError = signal('');

    copyTrip(): void {
        this.analytics.event('trip_copy', { logged_in: this.isLoggedIn() });
        if (!this.isLoggedIn()) {
            this.tripService.setPendingCopy('shared', this.shareToken());
            this.router.navigate(['/signup']);
            return;
        }
        this.copying.set(true);
        this.copyError.set('');
        this.tripService.copySharedTrip(this.shareToken()).subscribe({
            next: (tripId) => this.router.navigate(['/app/trips', tripId]),
            error: () => {
                this.copying.set(false);
                this.copyError.set("Couldn't copy this trip. Please try again.");
            },
        });
    }

    ngOnInit(): void {
      this.seo.update({
        title: 'Shared Trip',
        description: 'Roamwise to plan and manage your trips.',
        path: `/shared/trips/${this.shareToken()}`,
        noindex: true,
      });
    }

    // Rich preview when the link is pasted into WhatsApp etc. (runs during SSR too); still noindex
    private previewEffect = effect(() => {
      if (!this.tripResource.hasValue()) return;
      const trip = this.tripResource.value();
      const city = trip.destination.split(',')[0];
      const days = trip.days?.length ?? 0;
      const places = (trip.days ?? []).flatMap((d) => d.activities ?? []);
      const photo = places.find((a) => a.photoReference)?.photoReference;
      const highlights = places.slice(0, 3).map((a) => a.name).join(', ');
      this.seo.update({
        title: days ? `${days}-day trip to ${city}` : `Trip to ${city}`,
        description: highlights
          ? `A day-by-day ${city} itinerary on Roamwise: ${highlights} and more. Copy it and make it yours.`
          : `A ${city} itinerary planned on Roamwise. Copy it and make it yours.`,
        path: `/shared/trips/${this.shareToken()}`,
        image: photo
          ? `${environment.siteUrl}api/places/photo?photoReference=${encodeURIComponent(photo)}`
          : undefined,
        noindex: true,
      });
    });

    openPhoto(photoReference: string) {
        this.selectedPhotoUrl.set(environment.apiUrl + '/places/photo?photoReference=' + photoReference);
    }

    closePhoto() {
        this.selectedPhotoUrl.set(null);
    }

    shareToken = input.required<string>();
    tripResource = httpResource<TripDetail>(() => `/trips/shared/${this.shareToken()}`);

    @HostListener('document:keydown.escape')
    onEscapeKey() {
      if (this.selectedPhotoUrl()) {
        this.closePhoto();  
      }
    }
}