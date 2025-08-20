import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Movie } from '../models/movie.interface';
import { Genre } from '../models/genre.interface';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private base = environment.apiBaseUrl;         
  private heroListUrl = `${this.base}/movies/heroes/`;
  private getTeaserUrl = `${this.base}/movies/heroes/`;
  private getGenresUrl = `${this.base}/genres/`;


  constructor(private http: HttpClient) { }

  getHeroes(limit = 3) {
    const params = new HttpParams().set('limit', String(limit));
    return this.http.get<any[]>(this.heroListUrl, { params, withCredentials: true });
  }

  teaserUrl(id: number)    { return `${this.base}/movies/${id}/teaser/`; }
  thumbnailUrl(id: number) { return `${this.base}/movies/${id}/thumbnail/`; }
  logoUrl(id: number)      { return `${this.base}/movies/${id}/logo/`; }

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.getGenresUrl, { withCredentials: true });
  }

  getMoviesByGenre(slug: string, limit = 12): Observable<Movie[]> {
    const params = new HttpParams().set('limit', String(limit));

    return this.http.get<Movie[]>(`${this.base}/genres/${slug}/`, { params, withCredentials: true, });
  }

}
