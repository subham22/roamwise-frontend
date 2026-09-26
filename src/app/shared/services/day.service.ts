import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateDayRequest, DayResponse } from '../models/day.interface';
import { Observable } from 'rxjs';
import { FeasibilityIssue } from '../models/activity.interface';

@Injectable({
    providedIn: 'root',
})
export class DayService {

    private http = inject(HttpClient);

    createDay(tripId: string, request: CreateDayRequest): Observable<DayResponse> {
        return this.http.post<DayResponse>(`/trips/${tripId}/days`, request );
    }

    deleteDay(dayId: number): Observable<void> {
          return this.http.delete<void>(`/days/${dayId}`);
    }

    updateDay(dayId: number, request: CreateDayRequest): Observable<DayResponse> {
        return this.http.put<DayResponse>(`/days/${dayId}`, request);
    }

    getDayFeasibility(dayId: number): Observable<FeasibilityIssue[]> {
        return this.http.get<FeasibilityIssue[]>(`/days/${dayId}/feasibility`);
    }
}
