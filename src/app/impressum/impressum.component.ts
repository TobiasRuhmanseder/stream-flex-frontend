import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { LocaleService } from '../i18n/locale.service';
@Component({
  selector: 'app-impressum',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './impressum.component.html',
  styleUrl: './impressum.component.scss'
})
export class ImpressumComponent {


  constructor(readonly localeService: LocaleService) {
  }

}
