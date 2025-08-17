import { Component, HostListener } from '@angular/core';
import { ElementRef } from '@angular/core';
import { signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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

  toggleDropdown(): void {
    this.isOpen.update(v => !v);
  }

  async signOut(): Promise<void> {
    this.authService.signOut();
    this.isOpen.set(false);
    this.router.navigate(['/home/lets-go']);
  }

  // Close on outside click
  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: MouseEvent): void {
    if (!this.isOpen()) return;
    const target = ev.target as Node | null;
    if (target && !this.host.nativeElement.contains(target)) {
      this.isOpen.set(false);
    }
  }
}
