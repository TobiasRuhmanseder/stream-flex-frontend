import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { TranslatePipe } from '../i18n/translate.pipe';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
