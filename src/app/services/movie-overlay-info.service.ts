import { Injectable } from '@angular/core';
import { MovieInfoOverlayComponent } from '../dashboard/movie-info-overlay/movie-info-overlay.component';
import { Movie } from '../models/movie.interface';
import { Overlay } from '@angular/cdk/overlay';
import { Dialog } from '@angular/cdk/dialog';

@Injectable({
  providedIn: 'root'
})
export class MovieOverlayInfoService {

  constructor(private dialog: Dialog, private overlay: Overlay) { }

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
