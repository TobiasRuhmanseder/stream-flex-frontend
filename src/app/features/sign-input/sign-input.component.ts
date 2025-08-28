import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormControl} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-input.component.html',
  styleUrl: './sign-input.component.scss'
})

/**
 * A reusable input field component with label, type, and error handling.
 * This component manages focus state, value changes, and displays error messages
 * based on provided validation errors. Designed to be flexible for different input types
 * and to show user-friendly error messages.
 */
export class SignInputComponent implements OnInit, OnDestroy {
  @Input() control!: FormControl;
  @Input() label!: string;
  @Input() type: string = 'text';
  @Input() errorMessages: { [key: string]: string } = {};

  isFocused: boolean = false;
  hasValue: boolean = false;

  private valueChangesSubscription!: Subscription;

  /**
   * Initialize the component.
   * Set hasValue based on the control's current value.
   * Subscribe to value changes to update hasValue when the input changes.
   */
  ngOnInit(): void {
    this.hasValue = !!this.control.value;
    this.valueChangesSubscription = this.control.valueChanges.subscribe((value) => {
      this.hasValue = !!value;
    })
  }

  /**
   * Clean up when the component is destroyed.
   * Unsubscribe from the value changes subscription to avoid memory leaks.
   */
  ngOnDestroy(): void {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  }

  /**
   * Handle focus event on the input.
   * Set isFocused to true when the input is focused.
   */
  onFocus() {
    this.isFocused = true;
  }

  /**
   * Handle blur event on the input.
   * Set isFocused to false when the input loses focus.
   */
  onBlur() {
    this.isFocused = false;
  }

  /**
   * Get the error message to display.
   * Returns the first error message from errorMessages if the control is invalid and touched.
   * Returns a default message if no specific error message is found.
   * Returns null if there are no errors or the control is not touched.
   */
  get errorMessage(): string | null {
    if (
      (this.control.invalid && this.control.touched)
    ) {
      const firstErrorKey = Object.keys(this.control.errors ?? {})[0];
      return this.errorMessages[firstErrorKey] || 'Ungültige Eingabe.';
    }
    return null;
  }

}
