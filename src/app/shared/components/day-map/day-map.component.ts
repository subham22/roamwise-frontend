import { Component, computed, input } from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { TripDay } from '../../models/trip.interface';

@Component({
    selector: 'app-day-map',
    standalone: true,
    imports: [GoogleMap, MapMarker],
    templateUrl: './day-map.component.html',
    styleUrl: './day-map.component.css',
})
export class DayMapComponent {
    day = input.required<TripDay>();

    markerPositions = computed(
        () =>
            this.day()
                ?.activities.filter(
                    (a) => a.latitude != null && a.longitude != null,
                )
                .map((a) => ({
                    position: { lat: a.latitude!, lng: a.longitude! },
                    title: a.name,
                })) ?? [],
    );

    center = computed(() => {
        const positions = this.markerPositions();
        return positions.length > 0
            ? positions[0].position
            : { lat: 30.0, lng: 78.0 };
    });

   mapOptions = computed<google.maps.MapOptions>(() => {
  const centerValue = this.center();
  console.log('center value:', centerValue, typeof centerValue);
  return {
    center: centerValue,
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };
});
}
