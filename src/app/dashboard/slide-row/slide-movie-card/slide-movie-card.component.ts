import { Component, input } from '@angular/core';
import { Movie } from 'src/app/models/movie.interface';

@Component({
  selector: 'app-slide-movie-card',
  imports: [],
  templateUrl: './slide-movie-card.component.html',
  styleUrl: './slide-movie-card.component.scss'
})
export class SlideMovieCardComponent {
movie = input.required<Movie>();
}
