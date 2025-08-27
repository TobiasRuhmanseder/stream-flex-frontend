import { Dialog } from '@angular/cdk/dialog';
import { Component, input, signal, ElementRef, ViewChild, EventEmitter, Output, effect, AfterViewInit, OnDestroy } from '@angular/core';
import { MovieInfoOverlayComponent } from '../../movie-info-overlay/movie-info-overlay.component';
import { Overlay } from '@angular/cdk/overlay';
import { Movie } from 'src/app/models/movie.interface';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-hero-view',
  imports: [RouterLink],
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

  @Output() play = new EventEmitter<void>();
  @Output() ended = new EventEmitter<void>();
  @Output() canPlayReady = new EventEmitter<void>();
  @ViewChild('teaser') teaser?: ElementRef<HTMLVideoElement>;


  constructor(private dialog: Dialog, private overlay: Overlay) {
    effect(() => this.applySourceIfReady());
  }

  ngAfterViewInit(): void {
    this.applySourceIfReady();
  }

  ngOnDestroy(): void {
    document.removeEventListener('visibilitychange', this.visHandler);
  }

  applySourceIfReady() {
    const url = this.videoUrl();
    const teaser = this.teaser?.nativeElement;
    if (!url || !teaser) return;
    document.addEventListener('visibilitychange', this.visHandler, { once: true });
    this.userGesture();
  }

  tryPlay() {
    const teaser = this.teaser?.nativeElement;
    if (!teaser) return;
    teaser.muted = true;
    teaser.autoplay = true;
    teaser.play().catch(() => { });
  }

  onCanPlay() {
    this.canPlayReady.emit();
    this.tryPlay();
  }

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

  openOverlayMovieInfo(hero: Movie | null) {
    this.dialog.open(MovieInfoOverlayComponent, {
      data: hero,
      autoFocus: '#bttn',
      restoreFocus: true,
      disableClose: true,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
    });

  }
}

