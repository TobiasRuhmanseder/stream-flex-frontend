import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationSignalsService } from 'src/app/services/notification-signals.service';
import { EMPTY, catchError } from 'rxjs';
import { SignInputComponent } from 'src/app/features/sign-input/sign-input.component';
import { PasswordResetConfirmRequest } from 'src/app/models/user.interfaces';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SignInputComponent],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  uid = signal<string | null>(null);
  token = signal<string | null>(null);
  form!: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService, private notifyService: NotificationSignalsService,
  ) { }

  ngOnInit(): void {
    const qp = this.route.snapshot.queryParamMap;
    this.uid.set(qp.get('uid'));
    this.token.set(qp.get('token'));

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

  private passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const g = group as FormGroup;
      const pwd = g.get('password')?.value;
      const confirmCtrl = g.get('confirmPassword');
      const confirm = confirmCtrl?.value;

      if (!confirmCtrl) return null;
      // do not flag mismatch until both have values
      if (!pwd || !confirm) {
        // clear only our own error key while preserving others
        if (confirmCtrl.hasError('passwordMismatch')) {
          const { passwordMismatch, ...rest } = confirmCtrl.errors || {};
          confirmCtrl.setErrors(Object.keys(rest).length ? rest : null);
        }
        return null;
      }

      if (pwd === confirm) {
        // clear only our error key
        if (confirmCtrl.hasError('passwordMismatch')) {
          const { passwordMismatch, ...rest } = confirmCtrl.errors || {};
          confirmCtrl.setErrors(Object.keys(rest).length ? rest : null);
        }
        return null;
      }
      // set error on the confirm control so the existing template shows the message
      const newErrors = { ...(confirmCtrl.errors || {}), passwordMismatch: true };
      confirmCtrl.setErrors(newErrors);
      return { passwordMismatch: true };
    };
  }

  get passwordControl(): FormControl { return this.form.get('password') as FormControl; }
  get confirmPasswordControl(): FormControl { return this.form.get('confirmPassword') as FormControl; }

  resetPassword() {
    if (this.form.invalid ) return;
    const password = this.passwordControl.value;
    this.form.controls['password'].setValue('');
    this.form.controls['confirmPassword'].setValue('');
    this.form.markAsUntouched();
    const uid = this.uid(); 
    const token = this.token();
    if (!uid || !token) {
      this.notifyService.showKey('auth.resetInvalidLink', 'error');
      return;
    }
    const payload: PasswordResetConfirmRequest = {uid, token , newPassword: password};
    this.authService.passwordResetConfirm(payload).pipe(
      catchError(() => {
        this.notifyService.showKey('auth.resetFailed', 'error');
        return EMPTY;
      })
    ).subscribe(() => {
      this.notifyService.showKey('auth.resetSuccess', 'success');
      this.router.navigate(['/home/sign-in'], { queryParams: { email: this.route.snapshot.queryParamMap.get('email') ?? '' } });
    });
  }
}
