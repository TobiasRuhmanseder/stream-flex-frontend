import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SignInputComponent } from 'src/app/features/sign-input/sign-input.component';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NotificationSignalsService } from 'src/app/services/notification-signals.service';
import { AuthService } from 'src/app/services/auth.service';
import { SignInRequest } from 'src/app/models/user.interfaces';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { RecaptchaService } from 'src/app/services/recaptcha.service';
import { TranslatePipe } from 'src/app/i18n/translate.pipe';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, SignInputComponent, RouterLink, TranslatePipe],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})

/**
 * Component for user sign-in functionality.
 * Handles the sign-in form, validation, and submission.
 */
export class SignInComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private authService: AuthService,
    private router: Router, private notifyService: NotificationSignalsService, private recaptchaService: RecaptchaService) {
  }

  /**
   * Angular lifecycle hook called on component initialization.
   * Initializes the sign-in form.
   */
  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Initializes the reactive form with controls and validators.
   * Also pre-fills the email field if provided in the query parameters.
   */
  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(60), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)]],
      rememberMe: [false]
    })
    this.loginForm.controls['email'].setValue(this.getEmailFromLetsGoInput());
  }


  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }
  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }
  get rememberMe(): FormControl {
    return this.loginForm.get('rememberMe') as FormControl;
  }

  /**
   * Handles the sign-in process when the user submits the form.
   * Validates the form, requests a recaptcha token, and calls the authentication service.
   * Displays notifications on errors and redirects on success.
   */
  signIn() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.notifyService.showKey('http.badRequest');
      return;
    }
    const payloadBase = {
      username: this.emailControl.value,
      password: this.passwordControl.value,
      rememberMe: this.rememberMe.value
    };

    this.recaptchaService.getToken('signin').pipe(
      switchMap(token => this.authService.signIn({ ...payloadBase, recaptchaToken: token })),
      catchError(err => {
        if (err?.status === 401) {
          this.notifyService.showKey('auth.invalidCredentials', 'error');
          return EMPTY;
        }
        if (err?.status === 403) {
          this.notifyService.showKey('auth.accountNotActivated', 'error');
          this.router.navigate(['/home/sign-in/verify-email'], {
            queryParams: { email: this.emailControl.value, notActivated: true }
          });
          return EMPTY;
        }
        this.notifyService.showKey('http.unexpected', 'error');
        return EMPTY;
      })
    ).subscribe(() => {
      const redirect = this.route.snapshot.queryParamMap.get('redirectTo') ?? '/dashboard';
      this.router.navigateByUrl(redirect);
    });
  }

  /**
   * Retrieves the email value from the query parameters if available.
   * Returns an empty string if no email is found.
   */
  getEmailFromLetsGoInput(): string {
    const paramEmail = this.route.snapshot.queryParamMap.get('email') || '';
    return paramEmail
  }



}
