import { Component, computed, effect, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroViewComponent } from "./hero-view/hero-view.component";
import { MovieService } from 'src/app/services/movie.service';
import { NotificationSignalsService } from 'src/app/services/notification-signals.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { catchError, EMPTY, from, map, mergeMap, of, throwError, toArray } from 'rxjs';
import { Movie, Row } from 'src/app/models/movie.interface';
import { Genre } from 'src/app/models/genre.interface';
import { SlideRowComponent } from '../slide-row/slide-row.component';
import { FavoriteService } from 'src/app/services/favorite.service';




@Component({
  selector: 'app-start',
  imports: [CommonModule, HeroViewComponent, SlideRowComponent],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'


})
export class StartComponent implements OnInit {
  loading = signal(true);
  heroes = signal<Movie[]>([]);
  idx = signal(0);
  isFading = signal(false);
  loadingRows = signal(true);
  rows = signal<Row[]>([]);
  viewRows = computed(() => this.patchCurrentFavoritesIntoRow());


  constructor(private movieService: MovieService, private notifyService: NotificationSignalsService, private authService: AuthService, private router: Router, private favoritesService: FavoriteService) { }


  ngOnInit(): void {
    this.getHeroes();
    this.getGenreAndMovies();
  }


  patchCurrentFavoritesIntoRow(): Row[] {
    const favIds = this.favoritesService.favoriteIds();
    const currentRows = this.rows();
    if (!currentRows.length) return currentRows;
    return currentRows.map(r => ({
      ...r,
      movies: r.movies.map(m => ({
        ...m,
        is_favorite: favIds.has(m.id as number),
      })),
    }));

  }

  currentHero = computed(() => {
    const arr = this.heroes();
    return arr.length ? arr[this.idx() % arr.length] : null;
  });

  getHeroes() {
    this.movieService.getHeroes(3).subscribe({
      next: (arr) => {
        this.heroes.set(arr);
        this.loading.set(false);
        if (!arr.length) return;
        this.applyHero(0);
      },
      error: () => {
        this.loading.set(false);
        this.notifyService.showKey('http.unexpected', 'error');
      }
    });
  }

  getGenreAndMovies() {
    this.movieService.getGenres().pipe(
      mergeMap((genres: Genre[]) => {
        return from(genres).pipe(
          mergeMap(genres =>
            this.movieService.getMoviesByGenre(genres.slug).pipe(
              map(movies => ({ genre: genres.name, movies: movies })),
              catchError(() => of({ genre: genres.name, movies: [] as Movie[] } as Row))
            ),
          ),
          toArray(),
          map(rows => rows.filter(r => r.movies.length > 0))
        );
      })
    ).subscribe({
      next: rows => {
        this.rows.set(rows);
        this.loadingRows.set(false);
      },
      error: () => this.loadingRows.set(false)
    });
  }

  applyHero(i: number) {
    const arr = this.heroes();
    if (!arr.length) return;
    this.idx.set(i);
    const hero = arr[i % arr.length];
    const id = hero.id as number;
    this.authService.ensureFreshAccessWithoutLoadingIntcr().subscribe(() => { });
  }

  onEnded() {
    this.isFading.set(true);
    const next = (this.idx() + 1) % this.heroes().length;
    setTimeout(() => {
      this.applyHero(next);
    }, 1000);
  }

  onCanPlayReady() {
    requestAnimationFrame(() => this.isFading.set(false));
  }

  onPlayRequested() {
    const h = this.currentHero();
    if (!h) return;
    this.router.navigate(['/player', h.id]); // späterer vollwertiger Player
  }

}
