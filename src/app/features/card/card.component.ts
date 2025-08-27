import { Component, input } from '@angular/core';
import { Movie } from 'src/app/models/movie.interface';
import { MovieOverlayInfoService } from 'src/app/services/movie-overlay-info.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  movie = input<Movie | null>(null);

  constructor(private movieOverlayInfoService: MovieOverlayInfoService) { }

  open() {
    const movie = this.movie()
    if (!movie) return
    this.movieOverlayInfoService.open(movie)
  }
}
