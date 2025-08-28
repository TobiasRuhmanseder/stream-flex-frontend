import { Component, input } from '@angular/core';
import { Movie } from 'src/app/models/movie.interface';
import { MovieOverlayInfoService } from 'src/app/services/movie-overlay-info.service';
import { RouterLink } from '@angular/router';
import { FavoriteService } from 'src/app/services/favorite.service';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
/**
 * This is the CardComponent. It shows info about a movie and lets you open more details or toggle favorite status.
 */
export class CardComponent {
  movie = input<Movie | null>(null);

  constructor(private movieOverlayInfoService: MovieOverlayInfoService, private favoriteService: FavoriteService) { }

  /**
   * Opens the movie overlay with more details about the movie.
   * If there's no movie, it just does nothing.
   */
  open() {
    const movie = this.movie();
    if (!movie) return
    this.movieOverlayInfoService.open(movie);
  }

  /**
   * Toggles the favorite status of the movie.
   * If the movie is already favorite, it removes it from favorites.
   * Otherwise, it adds it to favorites.
   */
  toogleFavorite() {
    let movieId = this.movie()?.id;
    if (!movieId) return

    if (this.movie()?.is_favorite) {
      this.favoriteService.remove(movieId);
    } else {
      this.favoriteService.add(movieId);
    }
  }
}
