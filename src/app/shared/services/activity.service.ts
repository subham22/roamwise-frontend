import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivityResponse } from '../models/day.interface';
import { CreateActivityRequest } from '../models/activity.interface';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {

    private http = inject(HttpClient);
 
    createActivity(dayId: number, request: CreateActivityRequest): Observable<ActivityResponse> {
        return this.http.post<ActivityResponse>(`/days/${dayId}/activities`, request);
    }
    
    deleteActivity(dayId: number): Observable<void> {
        return this.http.delete<void>(`/days/${dayId}`);
    }

    updateActivity(activityId: number, request: CreateActivityRequest): Observable<ActivityResponse> {
        return this.http.put<ActivityResponse>(`/activities/${activityId}`, request);
    }
}
