import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Movie, ResolveSpeedRequest, ResolveSpeedResponse } from '../models/movie.interface';
import { Genre } from '../models/genre.interface';

@Injectable({
  providedIn: 'root'
})


/**
 * Service for working with movies, genres, and streaming.
 */
export class MovieService {
  private base = environment.apiBaseUrl;
  private heroListUrl = `${this.base}/movies/heroes/`;
  private getGenresUrl = `${this.base}/movies/genres/`;


  constructor(private http: HttpClient) { }

  /**
   * Get a list of hero movies.
   * @param limit How many heroes to get (default is 3).
   * @returns An observable with the list of hero movies.
   */
  getHeroes(limit = 3) {
    const params = new HttpParams().set('limit', String(limit));
    return this.http.get<any[]>(this.heroListUrl, { params, withCredentials: true });
  }

  /**
   * Get the list of all genres.
   * @returns An observable with the list of genres.
   */
  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.getGenresUrl, { withCredentials: true });
  }

  /**
   * Get movies for a specific genre.
   * @param slug The genre slug.
   * @param limit How many movies to get (default is 12).
   * @returns An observable with the list of movies for the genre.
   */
  getMoviesByGenre(slug: string, limit = 12): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.base}/movies/genres/${slug}/`, { withCredentials: true, });
  }

  /**
   * Resolve the best stream for a movie based on network and screen.
   * @param req The request with movie id, downlink, and screen height.
   * @returns An observable with the resolved stream info.
   */
  resolveStream(req: ResolveSpeedRequest): Observable<ResolveSpeedResponse> {
    const params = new HttpParams({
      fromObject: {
        ...(req.downlink != null ? { downlink: String(req.downlink) } : {}),
        ...(req.screenH != null ? { screen_h: String(req.screenH) } : {}),
      }
    });
    return this.http.get<ResolveSpeedResponse>(`${this.base}/movies/${req.movieId}/resolve-speed`, { params, withCredentials: true }
    );
  }
}
