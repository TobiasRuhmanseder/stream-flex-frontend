import { Component } from '@angular/core';

@Component({
    selector: 'app-language-dropdown',
    standalone: true,
    imports: [],
    templateUrl: './language-dropdown.component.html',
    styleUrl: './language-dropdown.component.scss'
})
export class LanguageDropdownComponent {
  languages: { code: string; label: string }[] = [
    { code: 'de', label: 'Deutsch' },
    { code: 'en', label: 'English' },
  ];
  selectedLanguage: { code: string; label: string } = this.languages[0];
  isOpen: boolean = false;

  // Toggles the dropdown's visibility
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  // Sets the selected language and closes the dropdown
  selectLanguage(language: { code: string; label: string }) {
    this.selectedLanguage = language;
    this.isOpen = false; // Close the dropdown
  }
}

