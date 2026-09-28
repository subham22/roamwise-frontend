import { Component, HostListener, inject, input, OnInit, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
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

    ngOnInit(): void {
      this.seo.update({
        title: 'Shared Trip',
        description: 'Roamwise to plan and manage your trips.',
        path: '/signup',
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