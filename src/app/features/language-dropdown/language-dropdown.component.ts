import { Component, signal, HostListener, inject, ElementRef } from '@angular/core';

@Component({
  selector: 'app-language-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './language-dropdown.component.html',
  styleUrl: './language-dropdown.component.scss'
})
export class LanguageDropdownComponent {
  private host = inject(ElementRef);
  languages = signal([
    { code: 'de', label: 'Deutsch' },
    { code: 'en', label: 'English' },
  ]);

  
  selectedLanguage = signal(this.languages()[0]);
  isOpen = signal<boolean>(false);

  // Toggles the dropdown's visibility
  toggleDropdown() {
    this.isOpen.update((v) => !v);
  }

  // Sets the selected language and closes the dropdown
  selectLanguage(language: { code: string; label: string }) {
    this.selectedLanguage.set(language);
    this.isOpen.set(false); // Close the dropdown
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

