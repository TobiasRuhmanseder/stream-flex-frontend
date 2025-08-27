import { Component, signal, HostListener, inject, ElementRef, computed } from '@angular/core';
import { LocaleService } from 'src/app/i18n/locale.service';

@Component({
  selector: 'app-language-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './language-dropdown.component.html',
  styleUrl: './language-dropdown.component.scss',
  host: { '[attr.aria-expanded]': 'isOpen()' }
})
export class LanguageDropdownComponent {

  isOpen = signal<boolean>(false);

  languages = signal([
    { code: 'de', label: 'Deutsch' },
    { code: 'en', label: 'English' },
  ]);

  constructor(private localeService: LocaleService, private host: ElementRef) { }


  selectedLanguage = computed(() => {
    const code = this.localeService.lang();
    const found = this.languages().find(l => l.code === code);
    return found ?? this.languages()[0];
  });


  // Toggles the dropdown's visibility
  toggleDropdown() {
    this.isOpen.update((v) => !v);
  }

  // Sets the selected language and closes the dropdown
  selectLanguage(language: { code: string; label: string }) {
    this.localeService.setLang(language.code as 'en' | 'de');
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: MouseEvent) {
    if (!this.isOpen()) return;
    const target = ev.target as Node | null;
    if (target && !this.host.nativeElement.contains(target)) {
      this.isOpen.set(false);
    }
  }
}
