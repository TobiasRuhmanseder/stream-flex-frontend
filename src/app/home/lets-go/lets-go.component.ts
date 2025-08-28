import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { SignInputComponent } from 'src/app/features/sign-input/sign-input.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationSignalsService } from 'src/app/services/notification-signals.service';
import { RecaptchaService } from 'src/app/services/recaptcha.service';
import { switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TranslatePipe } from 'src/app/i18n/translate.pipe';

/**
 * LetsGoComponent handles the "Let's Go" process where a user enters their email address.
 * It checks if the email exists in the backend and redirects the user either to the sign-in
 * page (if the email exists) or to the sign-up page (if the email does not exist).
 */
@Component({
  selector: 'app-lets-go',
  standalone: true,
  imports: [FormsModule, SignInputComponent, TranslatePipe],
  templateUrl: './lets-go.component.html',
  styleUrl: './lets-go.component.scss'
})
export class LetsGoComponent {

  emailControl = new FormControl<string>('', {
    validators: [Validators.required, Validators.email],
    nonNullable: true
  });


  constructor(private router: Router, private activatedRoute: ActivatedRoute, private recaptchaService: RecaptchaService, private authService: AuthService, private notificationService: NotificationSignalsService) {}


  /**
   * Validates the email input, performs a reCAPTCHA check, and calls the backend
   * to determine whether the entered email exists. Handles navigation based on the result.
   */
  letsGo() {
    this.emailControl.markAsTouched();
    if (this.emailControl.invalid) return;
    const email = this.emailControl.value;

    this.recaptchaService.getToken('check_email')
      .pipe(
        switchMap(token => this.authService.checkEmailExist({ email, recaptchaToken: token }))
      )
      .subscribe({
        next: ({ exists }) => {
          this.routingToSignUpOrSignIn(exists, email)
        },
        error: err => {
          this.notificationService.show({
            type: 'error',
            message: 'There was a problem with the bot check. Please try again later.'
          })
        }
      })
  }

  /**
   * Decides navigation to either the "sign-in" or "sign-up" page depending on the
   * backend response about whether the email exists.
   * @param exists - Whether the email exists in the backend.
   * @param email - The user's email address.
   */
  routingToSignUpOrSignIn(exists: any, email: string) {
    const route = exists ? 'sign-in' : 'sign-up';
    this.router.navigate([route], {
      relativeTo: this.activatedRoute.parent,
      queryParams: { email }
    })
  }

}