import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { LocaleService } from '../i18n/locale.service';

@Component({
  selector: 'app-privacy',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss'
})
export class PrivacyComponent {

  constructor(readonly localeService: LocaleService) {
  }
}
