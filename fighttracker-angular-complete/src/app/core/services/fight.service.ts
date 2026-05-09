import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fight, Page } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FightService {
  private base = `${environment.apiUrl}/fights`;
  constructor(private http: HttpClient) {}

  getAll(page = 0, size = 10): Observable<Page<Fight>> {
    return this.http.get<Page<Fight>>(this.base, {
      params: new HttpParams().set('page', page).set('size', size)
    });
  }

  getByCategory(category: string, page = 0, size = 10): Observable<Page<Fight>> {
    return this.http.get<Page<Fight>>(`${this.base}/category`, {
      params: new HttpParams()
        .set('category', category)
        .set('page', page)
        .set('size', size)
    });
  }

  getByFighter(fighterId: number): Observable<Fight[]> {
    return this.http.get<Fight[]>(`${this.base}/fighter/${fighterId}`);
  }
}
