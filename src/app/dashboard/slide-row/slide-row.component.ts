import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie, Row } from 'src/app/models/movie.interface';
import { SliderService } from 'src/app/services/slider.service';
import { MovieInfoOverlayComponent } from '../movie-info-overlay/movie-info-overlay.component';
import { Dialog } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { RouterLink } from '@angular/router';
import { CardComponent } from 'src/app/features/card/card.component';



type Mode = 'desktop' | 'snap';

@Component({
  selector: 'app-slide-row',
  imports: [CommonModule, CardComponent],
  templateUrl: './slide-row.component.html',
  styleUrl: './slide-row.component.scss'
})

/**
 * This component shows a row of movie cards that you can slide left or right.
 * It manages the current position in the row and how many cards are visible at once.
 * You can open a detailed overlay with info about a movie by clicking on it.
 */
export class SlideRowComponent {

  row = input<Row | null>(null);
  cardsPerView = this.sliderService.itemsPerScreen; // because of img { flex: 0 0 25% }
  index = signal<number>(0);
  readonly steps = computed<number>(() => this.calcSteps())
  stepDots = computed(() => Array.from({ length: this.steps() }));

  constructor(private sliderService: SliderService, private dialog: Dialog, private overlay: Overlay) { }

  /**
   * Move the slider one step back, unless already at the first step.
   */
  prev() {
    let prev = (this.index() === 0) ? null : this.index.set(this.index() - 1);
  }

  /**
   * Move the slider one step forward, unless already at the last step.
   */
  next() {
    let next = ((this.index()) + 1 === this.steps()) ? null : this.index.set(this.index() + 1);
  }

  /**
   * Calculate how many steps/pages the slider needs based on the number of movies and cards per view.
   * @returns number of steps
   */
  calcSteps(): number {
    let steps = Math.ceil(this.row()!.movies.length / this.cardsPerView());

    return steps
  }

  /**
   * Open a dialog overlay showing detailed info about the selected movie.
   * @param movie The movie to show info for
   */
  openOverlayMovieInfo(movie: Movie) {
    this.dialog.open(MovieInfoOverlayComponent, {
      data: movie,
      autoFocus: '#bttn',
      restoreFocus: true,
      disableClose: true,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
    });

  }
}
