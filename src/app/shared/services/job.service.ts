import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateTripRequest } from '../models/trip.interface';
import { Observable } from 'rxjs';
import { JobStatusResponse } from '../models/job.interface';

@Injectable({
  providedIn: 'root',
})
export class JobService {

    private http = inject(HttpClient);

    getJobStatus(jobId: number): Observable<JobStatusResponse> {
      return this.http.get<JobStatusResponse>(`/jobs/${jobId}`);
    }
}
