import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageDropdownComponent } from '../features/language-dropdown/language-dropdown.component';
import { RouterOutlet, RouterLink, RouterModule, ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { environment } from 'src/environments/environment';
import { RecaptchaService } from '../services/recaptcha.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LanguageDropdownComponent, RouterOutlet, RouterLink, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('fadeAnimation', [
      transition('* <=> *', [
        style({ opacity: 0 }), // Startzustand: transparent
        animate('500ms ease-in-out', style({ opacity: 1 })) // Endzustand: sichtbar
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  private scriptEl?: HTMLScriptElement;

  constructor(private activatedRoute: ActivatedRoute, private recaptchaService: RecaptchaService) { }

  ngOnInit(): void {
    this.recaptchaService.load();
  }

  ngOnDestroy(): void {
    this.recaptchaService.unload();
  }

  getRouteAnimationData() {
    return this.activatedRoute.firstChild?.snapshot.routeConfig?.path;
  }


}
