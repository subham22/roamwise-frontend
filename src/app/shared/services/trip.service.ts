import { inject, Injectable } from '@angular/core';
import { CreateTripRequest, TripResponse } from '../models/trip.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TripService {
 
    private http = inject(HttpClient);

    createTrip(request: CreateTripRequest): Observable<TripResponse> {
        return this.http.post<TripResponse>('/trips', request);
    }
}
