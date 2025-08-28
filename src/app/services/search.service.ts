import { Injectable, signal, inject, DestroyRef, computed } from '@angular/core';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, catchError, tap, finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Movie } from '../models/movie.interface';
import { environment } from 'src/environments/environment';
import { SKIP_LOADING_INTCR } from '../interceptor/http-context.tokens';
import { FavoriteService } from './favorite.service';



// =================http-context's Info========================

// SKIP_LOADING_INTCR: do not attempt interceptor loading for this request
//look at the interceptor/http-error.tokens.ts file for more informations

@Injectable({
  providedIn: 'root'
})


/**
 * Service for searching movies and handling search state.
 */
export class SearchService {

  private base = environment.apiBaseUrl;
  private searchUrl = `${this.base}/movies/search/`;
  private queries$ = new Subject<string>();

  readonly query = signal<string>('');
  readonly results = signal<Movie[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly viewResults = computed(() => this.patchCurrentFavoritesIntoRow());


  /**
   * Sets up the search observable and handles search logic.
   */
  constructor(private http: HttpClient, private destroyRef: DestroyRef, private favoriteService: FavoriteService) {
    this.init();
  }

  /**
   * Initializes the search pipeline for handling queries.
   */
  init() {
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

  /**
   * Adds favorite info to each movie in the search results.
   */
  patchCurrentFavoritesIntoRow() {
    const favIds = this.favoriteService.favoriteIds();
    const list = this.results();
    if (!list.length) return list;
    return list.map(m => ({
      ...m,
      is_favorite: favIds.has(m.id as number)
    }));
  }


  /**
   * Sets the current search query and triggers searching.
   * @param q The search string.
   */
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

  /**
   * Makes the HTTP GET request for searching movies.
   * @param params The HTTP query params.
   * @returns An observable with the movie results.
   */
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
