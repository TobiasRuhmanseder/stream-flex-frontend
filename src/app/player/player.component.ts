import { Component, ViewChild, ElementRef } from '@angular/core';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { VgMediaDirective } from '@videogular/ngx-videogular/core';


@Component({
  selector: 'app-player',
  standalone: true,
  imports: [VgCoreModule, VgControlsModule, VgOverlayPlayModule, VgBufferingModule],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
  src = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  vgApi!: VgApiService;
  @ViewChild(VgMediaDirective, { read: ElementRef }) mediaEl?: ElementRef<HTMLVideoElement>;


  onPlayerReady(api: VgApiService) {
    this.vgApi = api;
    const media = api.getDefaultMedia();
    const el = media?.elem as HTMLVideoElement | undefined;
    if (!el) return;
    el.playsInline = true;
    el.autoplay = true;

    const start = () => {
      el.play().catch(err => {
        console.warn('Autoplay blocked:', err);
      });
    };
    media.subscriptions.canPlay.subscribe(start);
    media.subscriptions.loadedMetadata.subscribe(start);
  }
}