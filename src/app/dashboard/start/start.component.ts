import { Component } from '@angular/core';
import { HeroViewComponent } from "./hero-view/hero-view.component";


@Component({
  selector: 'app-start',
  imports: [HeroViewComponent],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent {

}
