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
export class CardComponent {
  movie = input<Movie | null>(null);

  constructor(private movieOverlayInfoService: MovieOverlayInfoService, private favoriteService: FavoriteService) { }


  open() {
    const movie = this.movie()
    if (!movie) return
    this.movieOverlayInfoService.open(movie)
  }

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
