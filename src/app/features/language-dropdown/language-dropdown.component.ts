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
/**
 * This component shows a dropdown menu to pick a language.
 * It lets users select between German and English.
 * It also closes the dropdown if you click outside.
 */
export class LanguageDropdownComponent {

  isOpen = signal<boolean>(false);
  languages = signal([
    { code: 'de', label: 'Deutsch' },
    { code: 'en', label: 'English' },
  ]);

  
  constructor(private localeService: LocaleService, private host: ElementRef) { }

  /**
   * Gets the currently selected language from the list.
   */
  selectedLanguage = computed(() => {
    const code = this.localeService.lang();
    const found = this.languages().find(l => l.code === code);
    return found ?? this.languages()[0];
  });


  /**
   * Opens or closes the dropdown menu.
   */
  toggleDropdown() {
    this.isOpen.update((v) => !v);
  }

  /**
   * Changes the language and closes the dropdown.
   * @param language The language to select.
   */
  selectLanguage(language: { code: string; label: string }) {
    this.localeService.setLang(language.code as 'en' | 'de');
    this.isOpen.set(false);
  }

  /**
   * Closes the dropdown if you click outside of it.
   * @param ev The mouse click event.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: MouseEvent) {
    if (!this.isOpen()) return;
    const target = ev.target as Node | null;
    if (target && !this.host.nativeElement.contains(target)) {
      this.isOpen.set(false);
    }
  }
}
