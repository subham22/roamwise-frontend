import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TripResponse } from '../shared/models/trip.interface';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {

    tripsResource = httpResource<TripResponse[]>(() => "/trips");
}
