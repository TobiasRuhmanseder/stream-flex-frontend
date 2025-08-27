import { Injectable, signal, inject, DestroyRef } from '@angular/core';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, catchError, tap, finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Movie } from '../models/movie.interface';
import { environment } from 'src/environments/environment';
import { SKIP_LOADING_INTCR } from '../interceptor/http-context.tokens';

@Injectable({
  providedIn: 'root'
})

// =================http-context's Info========================

// SKIP_LOADING_INTCR: do not attempt interceptor loading for this request
//look at the interceptor/http-error.tokens.ts file for more informations

export class SearchService {

  private base = environment.apiBaseUrl;         // z.B. 'http://localhost:8000/api'
  private searchUrl = `${this.base}/movies/search/`;

  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  // Store
  readonly query = signal<string>('');
  readonly results = signal<Movie[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private queries$ = new Subject<string>();

  constructor() {
    this.queries$.pipe(
      map(q => (q ?? '').trim()),
      debounceTime(200),
      distinctUntilChanged(),
      tap(q => {
        this.query.set(q);
        this.error.set(null);
      }),
      // empty strings don't request
      filter(q => q.length > 0),
      tap(() => this.loading.set(true)),
      switchMap(q => {
        const params = new HttpParams().set('q', q);
        return this.searchGetRequest(params);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(list => {
      this.results.set(Array.isArray(list) ? list : []);
    });
  }

  /** initiates the search */
  setQuery(q: string) {
    this.queries$.next(q);
    if ((q ?? '').trim().length === 0) {
    // Clean up immediately when emptied
      this.query.set('');
      this.results.set([]);
      this.loading.set(false);
      this.error.set(null);
    }
  }

  private searchGetRequest(params: HttpParams) {
    const noLoadingCtx = new HttpContext().set(SKIP_LOADING_INTCR, true);

    return this.http.get<Movie[]>(this.searchUrl, { params, withCredentials: true, context: noLoadingCtx }).pipe(
      catchError(() => {
        this.error.set('searching error');
        return of([] as Movie[]);
      }),
      finalize(() => this.loading.set(false))
    );
  }
}
