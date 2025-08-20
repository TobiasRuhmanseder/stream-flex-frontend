import { Component, computed, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroViewComponent } from "./hero-view/hero-view.component";
import { Movie } from 'src/app/models/movie.interface';
import { MovieService } from 'src/app/services/movie.service';
import { NotificationSignalsService } from 'src/app/services/notification-signals.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-start',
  imports: [CommonModule, HeroViewComponent],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent implements OnInit {
  loading = signal(true);
  heroes = signal<any[]>([]);
  idx = signal(0);
  isFading = signal(false);

  current = computed(() => {
    const arr = this.heroes();
    return arr.length ? arr[this.idx() % arr.length] : null;
  });

  imageUrl = signal<string | null>(null);
  teaserUrl = signal<string | null>(null);

  @ViewChild(HeroViewComponent) heroView?: HeroViewComponent;

  constructor(private movieService: MovieService, private notifyService: NotificationSignalsService, private router: Router) { }

  ngOnInit(): void {
    this.movieService.getHeroes(3).subscribe({
      next: (arr) => {
        const heroes = Array.isArray(arr) ? arr.filter(Boolean) : [];
        this.heroes.set(heroes);
        
        this.loading.set(false);
        if (!heroes.length) return;
        this.applyHero(0);
      },
      error: () => {
        this.loading.set(false);
        this.notifyService.showKey('http.unexpected', 'error');
      }
    });
  }

  private applyHero(i: number) {
    const arr = this.heroes();
    if (!arr.length) return;
    this.idx.set(i);
    const hero = arr[i % arr.length];
    const id = hero.id as number;

    this.imageUrl.set(this.movieService.thumbnailUrl(id)); // oder logoUrl()
    this.teaserUrl.set(this.movieService.teaserUrl(id));
  }

  // Wird vom HeroView (video ended) ausgelöst
  onEnded() {
    this.isFading.set(true);
    const next = (this.idx() + 1) % this.heroes().length;
    setTimeout(() => {
      this.isFading.set(false);
      this.applyHero(next);
    }, 1200);
  }


  onCanPlayReady() {
    this.heroView?.fading.set(false);
  }

  onPlayRequested() {
    const h = this.current();
    if (!h) return;
    this.router.navigate(['/player', h.id]); // späterer vollwertiger Player
  }
}

