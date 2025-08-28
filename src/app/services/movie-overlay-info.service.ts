import { Injectable } from '@angular/core';
import { MovieInfoOverlayComponent } from '../dashboard/movie-info-overlay/movie-info-overlay.component';
import { Movie } from '../models/movie.interface';
import { Overlay } from '@angular/cdk/overlay';
import { Dialog } from '@angular/cdk/dialog';

/**
 * Service to manage opening the movie information overlay dialog.
 * Handles displaying detailed information about a selected movie in an overlay.
 */
@Injectable({
  providedIn: 'root'
})
export class MovieOverlayInfoService {

  constructor(private dialog: Dialog, private overlay: Overlay) { }

  /**
   * Opens the movie information overlay with details about the selected movie.
   * @param movie The movie object containing information to display in the overlay.
   */
  open(movie: Movie) {
    this.dialog.open(MovieInfoOverlayComponent, {
      data: movie,
      autoFocus: '#bttn',
      restoreFocus: true,
      disableClose: true,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
    });
  }
}
