import { CommonModule } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-day-weather',
  imports: [CommonModule],
  templateUrl: './day-weather.component.html',
  styleUrl: './day-weather.component.css',
})
export class DayWeatherComponent {

    tripId = input.required<string>();
    dayId = input.required<number>();

    weatherResource = httpResource<{weather: string}>(() => `/trips/${this.tripId()}/days/${this.dayId()}/weather`);

}
