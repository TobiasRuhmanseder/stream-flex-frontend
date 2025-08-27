import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Movie, ResolveSpeedRequest, ResolveSpeedResponse } from '../models/movie.interface';
import { Genre } from '../models/genre.interface';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private base = environment.apiBaseUrl;
  private heroListUrl = `${this.base}/movies/heroes/`;
  private getGenresUrl = `${this.base}/movies/genres/`;



  constructor(private http: HttpClient) { }

  getHeroes(limit = 3) {
    const params = new HttpParams().set('limit', String(limit));
    return this.http.get<any[]>(this.heroListUrl, { params, withCredentials: true });
  }

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.getGenresUrl, { withCredentials: true });
  }

  getMoviesByGenre(slug: string, limit = 12): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.base}/movies/genres/${slug}/`, { withCredentials: true, });
  }

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
