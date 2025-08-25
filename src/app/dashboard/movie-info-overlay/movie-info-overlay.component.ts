import { AfterViewInit, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { animate, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Movie } from 'src/app/models/movie.interface';
// import { CdkFocusInitial } from '@angular/cdk/a11y';

@Component({
  selector: 'app-movie-info-overlay',
  standalone: true,
  imports: [],
  templateUrl: './movie-info-overlay.component.html',
  styleUrl: './movie-info-overlay.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.7)' }),
        animate('225ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('180ms ease-in', style({ opacity: 0, transform: 'scale(0.7)' })),
      ]),
    ])
  ],
})
export class MovieInfoOverlayComponent implements AfterViewInit {
  /** steuert das @fadeInOut via *ngIf */
  show = false;

  constructor(
    @Inject(DIALOG_DATA) public movie: Movie,
    private ref: DialogRef<MovieInfoOverlayComponent>,
    private cdr: ChangeDetectorRef,
  ) { }

  ngAfterViewInit() {
    this.show = true;
    this.cdr.detectChanges();
  }

  close() {
    this.show = false;
  }

  onAnimDone(ev: AnimationEvent) {
    if ((ev as any).toState === 'void') {
      this.ref.close();
    }
  }

  playMovie() {

  }
}