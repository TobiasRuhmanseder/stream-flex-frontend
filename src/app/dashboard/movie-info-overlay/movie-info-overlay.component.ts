import { AfterViewInit, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { animate, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Movie } from 'src/app/models/movie.interface';
import { TranslatePipe } from 'src/app/i18n/translate.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movie-info-overlay',
  standalone: true,
  imports: [TranslatePipe, RouterLink],
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
/**
 * MovieInfoOverlayComponent displays detailed information about a selected movie
 * in an overlay dialog. It handles showing and hiding with animations, and
 * provides controls to close the overlay or play the movie.
 */
export class MovieInfoOverlayComponent implements AfterViewInit {
  /** steuert das @fadeInOut via *ngIf */
  show = false;

  constructor(
    @Inject(DIALOG_DATA) public movie: Movie,
    private ref: DialogRef<MovieInfoOverlayComponent>,
    private cdr: ChangeDetectorRef,
  ) { }

  /**
   * Called after the component's view has been initialized.
   * Triggers the animation to show the overlay.
   */
  ngAfterViewInit() {
    this.show = true;
    this.cdr.detectChanges();
  }

  /**
   * Closes the overlay by triggering the fade-out animation.
   */
  close() {
    this.show = false;
  }

  /**
   * Handles the animation completion event.
   * If the overlay has finished fading out, closes the dialog.
   * @param ev Animation event data
   */
  onAnimDone(ev: AnimationEvent) {
    if ((ev as any).toState === 'void') {
      this.ref.close();
    }
  }
}