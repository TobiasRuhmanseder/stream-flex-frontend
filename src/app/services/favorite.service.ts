import { Injectable, signal } from '@angular/core';
import { Movie } from '../models/movie.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, finalize, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  movies = signal<Movie[]>([]);
  favoriteIds = signal<Set<number>>(new Set());
  loading = signal(false);
  error = signal<boolean>(false);

  private base = environment.apiBaseUrl;


  constructor(private http: HttpClient) {
  }


  addFavorite(id: number) {
    return this.http.post(`${this.base}/movies/${id}/favorite/`, { withCredentials: true });
  }
  removeFavorite(id: number) {
    return this.http.delete(`${this.base}/movies/${id}/favorite/`, { withCredentials: true });
  }
  getFavorites() {
    return this.http.get<Movie[]>(`${this.base}/movies/favorites/`, { withCredentials: true });
  }


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
