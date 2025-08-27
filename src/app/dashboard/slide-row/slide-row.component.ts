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
export class SlideRowComponent {
  row = input<Row | null>(null);
  cardsPerView = this.sliderService.itemsPerScreen; // because of img { flex: 0 0 25% }
  index = signal<number>(0);
  readonly steps = computed<number>(() => this.calcSteps())
  stepDots = computed(() => Array.from({ length: this.steps() }));

  constructor(private sliderService: SliderService, private dialog: Dialog, private overlay: Overlay) { }


  prev() {
    let prev = (this.index() === 0) ? null : this.index.set(this.index() - 1);
  }

  next() {
    let next = ((this.index()) + 1 === this.steps()) ? null : this.index.set(this.index() + 1);
  }

  calcSteps(): number {
    let steps = Math.ceil(this.row()!.movies.length / this.cardsPerView());

    return steps
  }

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

