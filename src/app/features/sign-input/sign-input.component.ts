import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormControl, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-input.component.html',
  styleUrl: './sign-input.component.scss'
})
export class SignInputComponent implements OnInit, OnDestroy {
  @Input() control!: FormControl;
  @Input() label!: string;
  @Input() type: string = 'text';
  @Input() errorMessages: { [key: string]: string } = {};

  isFocused: boolean = false;
  hasValue: boolean = false;

  private valueChangesSubscription!: Subscription;


  ngOnInit(): void {
    this.hasValue = !!this.control.value;
    this.valueChangesSubscription = this.control.valueChanges.subscribe((value) => {
      this.hasValue = !!value;
    })
  }

  ngOnDestroy(): void {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  }

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
  }

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
