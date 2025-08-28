import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationSignalsService } from 'src/app/services/notification-signals.service';
import { EMPTY, catchError, switchMap } from 'rxjs';
import { SignInputComponent } from 'src/app/features/sign-input/sign-input.component';
import { PasswordResetConfirmRequest } from 'src/app/models/user.interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { RecaptchaService } from 'src/app/services/recaptcha.service';
import { TranslatePipe } from 'src/app/i18n/translate.pipe';


/**
 * This component handles the password reset flow.
 * It reads the uid and token from the URL query parameters,
 * builds and validates the reset form,
 * calls the backend to reset the password,
 * and navigates to the sign-in page on success.
 */
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SignInputComponent, TranslatePipe],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  uid = signal<string | null>(null);
  token = signal<string | null>(null);
  form!: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService, private notifyService: NotificationSignalsService,
    private recaptchaService: RecaptchaService) { }

  /**
   * On component init, read uid and token from URL query params,
   * then initialize the form with validation.
   */
  ngOnInit(): void {
    const qp = this.route.snapshot.queryParamMap;
    this.uid.set(qp.get('uid'));
    this.token.set(qp.get('token'));
    this.initForm();
  }

  /**
   * Build the form with password and confirm password fields,
   * add validation rules including required, length, pattern,
   * and a custom validator to check if passwords match.
   */
  initForm() {
    this.form = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(60),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      ]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordsMatchValidator() });
  }

  get passwordControl(): FormControl { return this.form.get('password') as FormControl; }
  get confirmPasswordControl(): FormControl { return this.form.get('confirmPassword') as FormControl; }


  /**
   * Returns a validator function that sets an error on confirmPassword
   * if it does not match the password field.
   */
  private passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const g = group as FormGroup;
      const pwd = g.get('password')?.value;
      const confirmCtrl = g.get('confirmPassword');
      const confirm = confirmCtrl?.value;

      if (!confirmCtrl) return null;
      if (!pwd || !confirm) {
        if (confirmCtrl.hasError('passwordMismatch')) {
          const { passwordMismatch, ...rest } = confirmCtrl.errors || {};
          confirmCtrl.setErrors(Object.keys(rest).length ? rest : null);
        }
        return null;
      }
      if (pwd === confirm) {
        if (confirmCtrl.hasError('passwordMismatch')) {
          const { passwordMismatch, ...rest } = confirmCtrl.errors || {};
          confirmCtrl.setErrors(Object.keys(rest).length ? rest : null);
        }
        return null;
      }
      // set error
      const newErrors = { ...(confirmCtrl.errors || {}), passwordMismatch: true };
      confirmCtrl.setErrors(newErrors);
      return { passwordMismatch: true };
    };
  }


  /**
   * When reset is triggered:
   * - Check form validity,
   * - Get uid and token from signals,
   * - Clear fields,
   * - Run reCAPTCHA to get token,
   * - Call backend to reset password,
   * - Show success or error messages,
   * - Navigate to sign-in page on success.
   */
  resetPassword() {
    if (this.form.invalid) return;
    const uid = this.uid();
    const token = this.token();
    const newPassword = this.passwordControl.value as string;
    this.emptyFields();

    if (!uid || !token) {
      this.notifyService.showKey('auth.resetInvalidLink', 'error');
      return;
    }
    this.recaptchaService.getToken('resetpassword').pipe(
      switchMap(recaptchaToken => {
        const payload: PasswordResetConfirmRequest = { uid, token, new_password: newPassword, recaptchaToken };
        return this.authService.passwordResetConfirm(payload);
      }),
      catchError(() => {
        this.notifyService.showKey('auth.resetFailed', 'error');
        return EMPTY;
      })
    ).subscribe(() => {
      this.notifyService.showKey('auth.resetSuccess', 'success');
      this.router.navigate(
        ['/home/sign-in'],
        { queryParams: { email: this.route.snapshot.queryParamMap.get('email') ?? '' } }
      );
    });
  }


  /**
   * Reset the password and confirm password fields,
   * and clear touched and pristine state on the form.
   */
  emptyFields() {
    this.passwordControl.reset('', { emitEvent: false });
    this.confirmPasswordControl.reset('', { emitEvent: false });
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }

}
