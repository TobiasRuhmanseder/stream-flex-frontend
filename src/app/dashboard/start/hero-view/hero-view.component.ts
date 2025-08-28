import { Dialog } from '@angular/cdk/dialog';
import { Component, input, signal, ElementRef, ViewChild, EventEmitter, Output, effect, AfterViewInit, OnDestroy } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { Movie } from 'src/app/models/movie.interface';
import { RouterLink } from '@angular/router';
import { MovieOverlayInfoService } from 'src/app/services/movie-overlay-info.service';
import { TranslatePipe } from 'src/app/i18n/translate.pipe';


/**
 * The HeroViewComponent displays a hero section for a movie, including video teaser and overlay info.
 */
@Component({
  selector: 'app-hero-view',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './hero-view.component.html',
  styleUrl: './hero-view.component.scss'
})
export class HeroViewComponent implements AfterViewInit, OnDestroy {
  currentHero = input<Movie | null>(null);
  imageUrl = input<string | null>(null);
  videoUrl = input<string | null>(null);
  logoUrl = input<string | null>(null);
  title = input<string>('');
  showImage = signal(false);

  private gestureBound = false;
  private visHandler = () => this.tryPlay();
  readonly error = signal<boolean>(false);

  @Output() play = new EventEmitter<void>();
  @Output() ended = new EventEmitter<void>();
  @Output() canPlayReady = new EventEmitter<void>();
  @ViewChild('teaser') teaser?: ElementRef<HTMLVideoElement>;


  /**
   * Creates the HeroViewComponent and sets up the effect to apply video source when ready.
   */
  constructor(private dialog: Dialog, private overlay: Overlay, private movieOverlayInfoService: MovieOverlayInfoService) {
    effect(() => this.applySourceIfReady());
  }

  /**
   * Called after the component's view has been initialized.
   * Applies the video source if it is ready.
   */
  ngAfterViewInit(): void {
    this.applySourceIfReady();
  }

  /**
   * Called when the component is destroyed.
   * Removes the visibility change event listener.
   */
  ngOnDestroy(): void {
    document.removeEventListener('visibilitychange', this.visHandler);
  }

  /**
   * Applies the video source if both the URL and video element are available.
   * Sets up a visibility change listener and checks for user gesture.
   */
  applySourceIfReady() {
    const url = this.videoUrl();
    const teaser = this.teaser?.nativeElement;
    if (!url || !teaser) return;
    document.addEventListener('visibilitychange', this.visHandler, { once: true });
    this.userGesture();
  }

  /**
   * Attempts to play the teaser video, muting and setting autoplay if needed.
   */
  tryPlay() {
    const teaser = this.teaser?.nativeElement;
    if (!teaser) return;
    teaser.muted = true;
    teaser.autoplay = true;
    teaser.play().catch(() => { });
  }

  /**
   * Called when the teaser video can play.
   * Emits the canPlayReady event and tries to play the video.
   */
  onCanPlay() {
    this.canPlayReady.emit();
    this.tryPlay();
  }

  /**
   * Ensures that a user gesture triggers video playback if needed.
   * Binds a pointerdown event once to attempt playback.
   */
  userGesture() {
    if (!this.gestureBound) {
      this.gestureBound = true;
      const kick = () => {
        this.tryPlay();
        window.removeEventListener('pointerdown', kick, true);
      };
      window.addEventListener('pointerdown', kick, true);
    }
  }

  /**
   * Opens the overlay with detailed movie information for the current hero movie.
   */
  openOverlayMovieInfo() {
    let movie = this.currentHero()
    if (!movie) return
    this.movieOverlayInfoService.open(movie);
  }
}

