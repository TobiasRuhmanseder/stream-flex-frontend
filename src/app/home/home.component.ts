import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { RecaptchaService } from '../services/recaptcha.service';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, FooterComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('fadeAnimation', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('500ms ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})

/**
 * The root home component responsible for handling the main layout,
 * including header, footer, routed content, and fade animations between routes.
 */
export class HomeComponent implements OnInit, OnDestroy {
  private scriptEl?: HTMLScriptElement;

  constructor(private activatedRoute: ActivatedRoute, private recaptchaService: RecaptchaService) { }

  /**
   * 
   * Loads the reCAPTCHA service.
   */
  ngOnInit(): void {
    this.recaptchaService.load();
  }

  /**
   * Angular lifecycle hook that runs just before the component is destroyed.
   * Unloads the reCAPTCHA service.
   */
  ngOnDestroy(): void {
    this.recaptchaService.unload();
  }

  /**
   * Gets the route animation data for the current activated route.
   * Used to determine animation state between route transitions.
   */
  getRouteAnimationData() {
    return this.activatedRoute.firstChild?.snapshot.routeConfig?.path;
  }
}
