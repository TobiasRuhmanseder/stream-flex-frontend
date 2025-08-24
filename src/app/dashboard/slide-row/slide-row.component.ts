import { Component, computed, effect, ElementRef, inject, input, signal, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie, Row } from 'src/app/models/movie.interface';
import { SlideMovieCardComponent } from "./slide-movie-card/slide-movie-card.component";
import { RouterLink } from '@angular/router';
import { SliderService } from 'src/app/services/slider.service';



type Mode = 'desktop' | 'snap';

@Component({
  selector: 'app-slide-row',
  imports: [CommonModule],
  templateUrl: './slide-row.component.html',
  styleUrl: './slide-row.component.scss'
})
export class SlideRowComponent {

  row = input<Row | null>(null);


  images = signal([
    'https://placehold.co/210/orange/white/?text=1',
    'https://placehold.co/220/orange/white/?text=2',
    'https://placehold.co/230/orange/white/?text=3',
    'https://placehold.co/240/orange/white/?text=4',
    'https://placehold.co/250/orange/white/?text=5',
    'https://placehold.co/260/orange/white/?text=6',
    'https://placehold.co/270/orange/white/?text=7',
    'https://placehold.co/280/orange/white/?text=8',
    'https://placehold.co/290/orange/white/?text=9',
  ]);

  cardsPerView = this.sliderService.itemsPerScreen; // because of img { flex: 0 0 25% }
  index = signal<number>(0);
  readonly steps = computed<number>(() => this.calcSteps())
  stepDots = computed(() => Array.from({ length: this.steps() }));

  constructor(private sliderService: SliderService) { }


  prev() {
    let prev = (this.index() === 0) ? null : this.index.set(this.index() - 1);
  }

  next() {
    let next = ((this.index() + 1) === this.steps()) ? null : this.index.set(this.index() + 1);
  }

  calcSteps(): number {
    let steps = Math.ceil(this.images().length / this.cardsPerView());
    return steps
  }

  playMovie(id: number) {
    console.log('play');

  }

  openOverlayMovieInfo(movie: Movie) {
    console.log('info');

  }
}

