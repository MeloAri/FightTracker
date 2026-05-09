import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Follow, ApiResponse, FREE_FOLLOW_LIMIT } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FollowService {
  private base = `${environment.apiUrl}/follows`;

  // Reactive local cache for follows (avoids refetching constantly)
  readonly follows = signal<Follow[]>([]);
  readonly followCount = signal(0);
  readonly canFollow = () => this.followCount() < FREE_FOLLOW_LIMIT;

  constructor(private http: HttpClient) {}

  // GET /follows  (uses JWT via interceptor → @AuthenticationPrincipal)
  loadFollows(): Observable<Follow[]> {
    return this.http.get<Follow[]>(this.base).pipe(
      tap(list => {
        this.follows.set(list);
        this.followCount.set(list.length);
      })
    );
  }

  // POST /follows  body: { fighterId }
  follow(fighterId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.base, { fighterId }).pipe(
      tap(() => this.loadFollows().subscribe())
    );
  }

  isFollowing(fighterId: number): boolean {
    return this.follows().some(f => f.fighterId === fighterId);
  }
}
