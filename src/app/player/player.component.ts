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
export class PlayerComponent implements OnInit {
  src = signal('');
  vgApi!: VgApiService;
  @ViewChild(VgMediaDirective, { read: ElementRef }) mediaEl?: ElementRef<HTMLVideoElement>;

  constructor(private route: ActivatedRoute, private movieService: MovieService, private notifyService: NotificationSignalsService) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    const navAny = navigator as any;
    const downlink: number | null = navAny?.connection?.downlink ?? null;
    const screenH: number | null = Math.round(window.visualViewport?.height ?? window.innerHeight ?? document.documentElement.clientHeight ?? 0);

    this.movieService.resolveStream({ movieId: id, downlink, screenH }).subscribe({
      next: res => {
        this.src.set(res.url);
        console.log(res);

        this.notifyService.showKey(res.message_key as any, 'info');
      },
      error: () => this.notifyService.showKey('player.error.source', 'error')
    });
  }

  onPlayerReady(api: VgApiService) {
    this.vgApi = api;
    const media = api.getDefaultMedia();
    const el = media?.elem as HTMLVideoElement | undefined;
    if (!el) return;
    el.playsInline = true;
    el.autoplay = true;

  }
}