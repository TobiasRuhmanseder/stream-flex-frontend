import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { delay, switchMap, tap } from 'rxjs';
import { SignInputComponent } from 'src/app/features/sign-input/sign-input.component';
import { AuthService } from 'src/app/services/auth.service';
import { RecaptchaService } from 'src/app/services/recaptcha.service';
import { NotificationSignalsService } from 'src/app/services/notification-signals.service';
import { Router } from '@angular/router';
import { SignUpResponse } from 'src/app/models/user.interfaces';
import { TranslatePipe } from 'src/app/i18n/translate.pipe';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, SignInputComponent, TranslatePipe],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private recaptchaService: RecaptchaService, private authService: AuthService, private notificationService: NotificationSignalsService) {
  }

  /**
   * Angular lifecycle method called once component is initialized.
   * Here, we set up the form and prefill the email if it's in the URL.
   * Also, we watch the password field to update confirm password validation.
   */
  ngOnInit(): void {
    this.initForm();
    this.signupForm.controls['email'].setValue(this.getEmailFromUrl());
    this.passwordControl.valueChanges.subscribe(() => {
      this.confirmPasswordControl.updateValueAndValidity({ onlySelf: true });
    });
  }

  /**
   * Initialize the signup form with email, password, and confirmPassword fields.
   * Each field has validators to check for proper input.
   */
  initForm() {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(60),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      ]],
      confirmPassword: ['', [Validators.required, this.confirmPasswordValidator()]],
    });
  }

  /**
   * Custom validator to check if confirmPassword matches the password field.
   * Returns an error object if they don't match, otherwise null.
   */
  private confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent as FormGroup | null;
      if (!parent) return null;
      const pwd = parent.get('password')?.value;
      const confirm = control.value;
      if (!confirm || !pwd) return null;
      return confirm === pwd ? null : { passwordMismatch: true };
    };
  }

  get emailControl(): FormControl {
    return this.signupForm.get('email') as FormControl;
  }
  get passwordControl(): FormControl {
    return this.signupForm.get('password') as FormControl;
  }
  get confirmPasswordControl(): FormControl {
    return this.signupForm.get('confirmPassword') as FormControl;
  }

  /**
   * Called when the user submits the signup form.
   * If the form is valid, it gets a recaptcha token, then calls the signup API.
   * On success, it shows a success notification and navigates to the success page.
   */
  signup() {
    if (this.signupForm.invalid) return
    const email = this.emailControl.value
    const password = this.passwordControl.value

    this.recaptchaService.getToken('signup')
      .pipe(
        switchMap(token => this.authService.signUp({ email, password, recaptchaToken: token })),
        tap((resp: SignUpResponse) => {
          this.notificationService.showKey('signup.success', 'success');
        }),
        delay(2000)
      ).subscribe((resp: SignUpResponse) => {
        this.router.navigate(['sign-up-success'], {
          relativeTo: this.route.parent,
          queryParams: { email }
        })
      })
  }

  /**
   * Helper method to get the 'email' query parameter from the URL.
   * Returns an empty string if no email is found.
   */
  getEmailFromUrl(): string {
    const paramEmail = this.route.snapshot.queryParamMap.get('email') || '';
    return paramEmail
  }
}
