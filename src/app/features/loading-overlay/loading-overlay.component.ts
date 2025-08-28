import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-overlay',
  imports: [],
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.scss'
})
/**
 * Shows a loading overlay when visible is true.
 */
export class LoadingOverlayComponent {
  @Input() visible = false;
}
