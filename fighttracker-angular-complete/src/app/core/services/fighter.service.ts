import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fighter } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FighterService {
  private base = `${environment.apiUrl}/fighters`;
  constructor(private http: HttpClient) {}

  /** GET /fighters/search?name= — busca por nome */
  search(name: string): Observable<Fighter[]> {
    return this.http.get<Fighter[]>(`${this.base}/search`, {
      params: new HttpParams().set('name', name)
    });
  }

  /** GET /fighters/category?category= — busca por modalidade */
  getByCategory(category: string): Observable<Fighter[]> {
    return this.http.get<Fighter[]>(`${this.base}/category`, {
      params: new HttpParams().set('category', category)
    });
  }

  create(fighter: { name: string; category: string }): Observable<Fighter> {
    return this.http.post<Fighter>(this.base, fighter);
  }
}
