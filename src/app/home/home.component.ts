import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageDropdownComponent } from '../features/language-dropdown/language-dropdown.component';
import { RouterOutlet, RouterLink, RouterModule, ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';


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
export class HomeComponent {

  constructor(private activatedRoute: ActivatedRoute) {
  }

  getRouteAnimationData() {
    return this.activatedRoute.firstChild?.snapshot.routeConfig?.path;
  }
}
