import { Injectable, signal } from '@angular/core';
import { Movie } from '../models/movie.interface';
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, finalize, of } from 'rxjs';
import { SKIP_LOADING_INTCR } from '../interceptor/http-context.tokens';


// =================http-context's Info========================

// SILENT_AUTH_CHECK: no toast/console on unauthenticated /me
// SKIP_AUTH_REFRESH: do not attempt interceptor refresh for this request
// SKIP_LOADING_INTCR: do not attempt interceptor loading for this request
//look at the interceptor/http-error.tokens.ts file for more informations


@Injectable({
  providedIn: 'root'
})

/**
 * Service for managing favorite movies.
 * Handles adding, removing, and loading favorites for the user.
 */
export class FavoriteService {
  movies = signal<Movie[]>([]);
  favoriteIds = signal<Set<number>>(new Set());
  loading = signal(false);
  error = signal<boolean>(false);

  private base = environment.apiBaseUrl;


  constructor(private http: HttpClient) {}

  /**
   * Sends a request to add a movie to favorites.
   * @param id The movie id.
   */
  addFavorite(id: number) {
    const ctx = new HttpContext().set(SKIP_LOADING_INTCR, true);
    return this.http.post(`${this.base}/movies/${id}/favorite/`, {}, { withCredentials: true, context: ctx });
  }
  /**
   * Sends a request to remove a movie from favorites.
   * @param id The movie id.
   */
  removeFavorite(id: number) {
    const ctx = new HttpContext().set(SKIP_LOADING_INTCR, true);
    return this.http.delete(`${this.base}/movies/${id}/favorite/`, { withCredentials: true, context: ctx });
  }
  /**
   * Gets the user's favorite movies from the server.
   */
  getFavorites() {
    const ctx = new HttpContext().set(SKIP_LOADING_INTCR, true);
    return this.http.get<Movie[]>(`${this.base}/movies/favorites/`, { withCredentials: true, context: ctx });
  }

  /**
   * Loads the user's favorite movies and updates state.
   */
  load() {
    this.loading.set(true);
    this.error.set(false);
    this.getFavorites().pipe(
      catchError(() => {
        this.error.set(true);
        return of([] as Movie[]);
      }),
      finalize(() => this.loading.set(false))
    )
      .subscribe(list => {
        this.movies.set(list);
        const ids = new Set(list.map(m => m.id));
        this.favoriteIds.set(ids);
      });
  }

  /**
   * Removes a movie from favorites and updates state.
   * @param id The movie id.
   */
  remove(id: number) {
    const currentIds = new Set(this.favoriteIds());
    if (currentIds.has(id)) {
      currentIds.delete(id);
      this.favoriteIds.set(currentIds);
    }
    this.removeFavorite(id).subscribe({
      next: () => { this.load() },
      error: () => {
        //error
        const revertedIds = new Set(this.favoriteIds());
        revertedIds.add(id);
        this.favoriteIds.set(revertedIds);
      }
    });
  }

  /**
   * Adds a movie to favorites and updates state.
   * @param id The movie id.
   */
  add(id: number) {
    const currentIds = new Set(this.favoriteIds());
    if (!currentIds.has(id)) {
      currentIds.add(id);
      this.favoriteIds.set(currentIds);
    }
    this.addFavorite(id).subscribe({
      next: () => { this.load() },
      error: () => {
        //error
        const revertedIds = new Set(this.favoriteIds());
        revertedIds.delete(id);
        this.favoriteIds.set(revertedIds);
      }
    });
  }
}
