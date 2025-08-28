import { Component, HostListener } from '@angular/core';
import { ElementRef } from '@angular/core';
import { signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

/**
 * UserMenuDropdownComponent controls the user menu dropdown.
 * It handles toggling the dropdown open and closed, signing the user out,
 * and closing the dropdown when the user clicks outside of it.
 */
@Component({
  selector: 'app-user-menu-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './user-menu-dropdown.component.html',
  styleUrl: './user-menu-dropdown.component.scss'
})
export class UserMenuDropdownComponent {
  isOpen = signal<boolean>(false);

  constructor(
    private host: ElementRef<HTMLElement>,
    private authService: AuthService,
    private router: Router,
  ) { }

  /**
   * Toggles the dropdown open or closed.
   */
  toggleDropdown(): void {
    this.isOpen.update(v => !v);
  }

  /**
   * Signs the user out, closes the dropdown, and redirects to the home page.
   */
  async signOut(): Promise<void> {
    this.authService.signOut();
    this.isOpen.set(false);
    this.router.navigate(['/home/lets-go']);
  }

  /**
   * Closes the dropdown if the user clicks outside of it.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: MouseEvent): void {
    if (!this.isOpen()) return;
    const target = ev.target as Node | null;
    if (target && !this.host.nativeElement.contains(target)) {
      this.isOpen.set(false);
    }
  }
}
