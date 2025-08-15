import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SignInputComponent } from 'src/app/features/sign-input/sign-input.component';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationSignalsService } from 'src/app/services/notification-signals.service';
import { EMPTY, catchError, switchMap } from 'rxjs';
import { RecaptchaService } from 'src/app/services/recaptcha.service';
import { PasswordResetRequest } from 'src/app/models/user.interfaces';

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
  constructor(private fb: FormBuilder, private authService: AuthService, private notifyService: NotificationSignalsService,
    private router: Router, private recaptchaService: RecaptchaService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get emailControl(): FormControl { return this.form.get('email') as FormControl; }

  submit() {
    if (this.form.invalid) return;
    const email = this.emailControl.value as string;
    this.emptyFields();

    this.recaptchaService.getToken('resetpasswordrequest').pipe(
      switchMap(recaptchaToken => {
        const payload: PasswordResetRequest = { email, recaptchaToken };
        return this.authService.passwordResetRequest(payload);
      }),
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

  emptyFields() {
    this.emailControl.reset('', { emitEvent: false });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

}
