import { httpResource } from '@angular/common/http';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-travel-time',
  imports: [],
  templateUrl: './travel-time.component.html',
  styleUrl: './travel-time.component.css',
})
export class TravelTimeComponent {
  origin = input.required<string>();
  destination = input.required<string>();

    travelResource = httpResource<{ travelTime: string }>(() => ({
    url: '/activities/travel-time',
    method: 'GET',
    params: {
      origin: encodeURI( this.origin()),
      destination: encodeURI(this.destination()),
    },
  }));
}