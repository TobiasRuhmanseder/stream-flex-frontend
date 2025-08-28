import { Component, ViewChild, ElementRef, OnInit, signal } from '@angular/core';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { VgMediaDirective } from '@videogular/ngx-videogular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { NotificationSignalsService } from '../services/notification-signals.service';


@Component({
  selector: 'app-player',
  standalone: true,
  imports: [VgCoreModule, VgControlsModule, VgOverlayPlayModule, VgBufferingModule, RouterLink],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})

/**
 * PlayerComponent is responsible for displaying and controlling the video player.
 * It loads the video stream based on the movie ID from the route and handles video playback setup.
 */
export class PlayerComponent implements OnInit {
  src = signal('');
  vgApi!: VgApiService;
  @ViewChild(VgMediaDirective, { read: ElementRef }) mediaEl?: ElementRef<HTMLVideoElement>;

  constructor(private route: ActivatedRoute, private movieService: MovieService, private notifyService: NotificationSignalsService) { }

  /**
   * Called when the component initializes.
   * It gets the movie ID from the URL and starts loading the video stream.
   */
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
    const navAny = navigator as any;
    const downlink: number | null = navAny?.connection?.downlink ?? null;
    const screenH: number | null = Math.round(window.visualViewport?.height ?? window.innerHeight ?? document.documentElement.clientHeight ?? 0);
    this.resolveStream(id, downlink, screenH);
  }

  /**
   * Loads the video stream URL based on movie ID, network speed, and screen height.
   * Shows notifications for success or error.
   */
  resolveStream(id: number, downlink: number | null, screenH: number) {
    this.movieService.resolveStream({ movieId: id, downlink, screenH }).subscribe({
      next: res => {
        this.src.set(res.url);
        this.notifyService.showKey(res.message_key as any, 'info');
      },
      error: () => this.notifyService.showKey('player.error.source', 'error')
    });
  }

  /**
   * Called when the video player is ready.
   * Sets up the video element for inline playback and autoplay.
   */
  onPlayerReady(api: VgApiService) {
    this.vgApi = api;
    const media = api.getDefaultMedia();
    const el = media?.elem as HTMLVideoElement | undefined;
    if (!el) return;
    el.playsInline = true;
    el.autoplay = true;

  }
}