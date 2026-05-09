import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { FightEvent, CreateEventRequest } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EventService {
  private base = `${environment.apiUrl}/events`;
  constructor(private http: HttpClient) {}

  getUpcoming(): Observable<FightEvent[]> {
    return this.http.get<FightEvent[]>(`${this.base}/upcoming`).pipe(
      tap(events => console.log('[EventService] upcoming:', events?.length, events)),
      catchError(err => {
        console.error('[EventService] Error:', err.status, err.error);
        return throwError(() => err);
      })
    );
  }

  getByCategory(category: string): Observable<FightEvent[]> {
    return this.http.get<FightEvent[]>(`${this.base}/upcoming/category`, {
      params: new HttpParams().set('category', category)
    });
  }

  create(event: CreateEventRequest): Observable<FightEvent> {
    return this.http.post<FightEvent>(this.base, event);
  }
}
