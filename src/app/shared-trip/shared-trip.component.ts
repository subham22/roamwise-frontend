import { Component, HostListener, inject, input, OnInit, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { TripService } from '../shared/services/trip.service';
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
    private router = inject(Router);

    isLoggedIn = this.auth.isLoggedIn;
    copying = signal(false);
    copyError = signal('');

    copyTrip(): void {
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
        path: `/shared/trips/${this.shareToken}`,
        noindex: true,
      });
    }

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