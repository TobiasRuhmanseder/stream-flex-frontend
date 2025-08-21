import { Component, computed, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroViewComponent } from "./hero-view/hero-view.component";
import { MovieService } from 'src/app/services/movie.service';
import { NotificationSignalsService } from 'src/app/services/notification-signals.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { catchError, EMPTY, throwError } from 'rxjs';



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
  logoUrl = signal<string | null>(null);

  @ViewChild(HeroViewComponent) heroView?: HeroViewComponent;

  constructor(private movieService: MovieService, private notifyService: NotificationSignalsService, private authService: AuthService, private router: Router) { }

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

  applyHero(i: number) {
    const arr = this.heroes();
    if (!arr.length) return;
    this.idx.set(i);
    const hero = arr[i % arr.length];
    const id = hero.id as number;

    this.authService.ensureFreshAccessWithoutLoadingIntcr().pipe(catchError((err) => {
      this.imageUrl.set(this.movieService.thumbnailUrl(id));
      return err
    })).subscribe(() => {
      this.logoUrl.set(this.movieService.logoUrl(id));
      this.teaserUrl.set(this.movieService.teaserUrl(id));
      this.imageUrl.set(this.movieService.thumbnailUrl(id));
    });
  }

  onEnded() {
    this.isFading.set(true);
    const next = (this.idx() + 1) % this.heroes().length;
    setTimeout(() => {
      this.applyHero(next);
    }, 1200);
  }


  onCanPlayReady() {
    requestAnimationFrame(() => this.isFading.set(false));
  }

  onPlayRequested() {
    const h = this.current();
    if (!h) return;
    this.router.navigate(['/player', h.id]); // späterer vollwertiger Player
  }

}

