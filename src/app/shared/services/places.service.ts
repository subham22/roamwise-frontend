import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateTripRequest } from '../models/trip.interface';
import { Observable } from 'rxjs';
import { JobStatusResponse } from '../models/job.interface';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {

    private http = inject(HttpClient);

    getSuggestions(input: String): Observable<any> {
      return this.http.get('/places/autocomplete?input=' + input);
    }
}
