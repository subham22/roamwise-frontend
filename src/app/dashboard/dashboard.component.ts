import { httpResource } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TripResponse } from '../shared/models/trip.interface';
import { SeoService } from '../shared/services/seo.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {

    tripsResource = httpResource<TripResponse[]>(() => "/trips");

    private seo = inject(SeoService).update({
      	title: 'Dashboard',
        description: 'Dashboard - India trip guides, built for real travel',
        path: '/app/dashboard',
        noindex: true,
    })
}
