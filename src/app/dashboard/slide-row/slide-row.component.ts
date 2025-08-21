import { Component, computed, effect, ElementRef, input, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from 'src/app/models/movie.interface';
import { SlideMovieCardComponent } from "./slide-movie-card/slide-movie-card.component";
import { RouterLink } from '@angular/router';


type Mode = 'desktop' | 'snap';

@Component({
  selector: 'app-slide-row',
  imports: [CommonModule],
  templateUrl: './slide-row.component.html',
  styleUrl: './slide-row.component.scss'
})
export class SlideRowComponent {

}
