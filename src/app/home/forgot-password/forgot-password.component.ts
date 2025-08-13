import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SignInputComponent } from 'src/app/features/sign-input/sign-input.component';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationSignalsService } from 'src/app/services/notification-signals.service';
import { EMPTY, catchError } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SignInputComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  form: FormGroup;

  // Constructor-based DI (statt inject())
  constructor(private fb: FormBuilder, private authService: AuthService, private notifyService: NotificationSignalsService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get emailControl(): FormControl { return this.form.get('email') as FormControl; }

  submit() {
    if (this.form.invalid) return;
    this.form.controls['email'].setValue('');
    this.form.markAsUntouched();
    const email = this.emailControl.value as string;

    this.authService.passwordResetRequest(email).pipe(
      catchError(() => {
        this.notifyService.showKey('auth.resetEmailSent', 'info');
        this.router.navigate(['/home']);
        return EMPTY;
      })
    ).subscribe(() => {
      this.notifyService.showKey('auth.resetEmailSent', 'info');
      this.router.navigate(['/home']);
    });
  }
}
