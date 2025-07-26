import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { SignInputComponent } from 'src/app/features/sign-input/sign-input.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationSignalsService } from 'src/app/services/notification-signals.service';
import { RecaptchaService } from 'src/app/services/recaptcha.service';
import { switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
declare const grecaptcha: any;

@Component({
  selector: 'app-lets-go',
  standalone: true,
  imports: [FormsModule, SignInputComponent],
  templateUrl: './lets-go.component.html',
  styleUrl: './lets-go.component.scss'
})
export class LetsGoComponent implements OnInit {

  emailControl = new FormControl<string>('', {
    validators: [Validators.required, Validators.email],
    nonNullable: true
  });


  constructor(private router: Router, private activatedRoute: ActivatedRoute, private recaptchaService: RecaptchaService, private authService: AuthService, private notificationService: NotificationSignalsService) {
  }

  ngOnInit(): void {

  }

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

  routingToSignUpOrSignIn(exists: any, email: string) {
    const route = exists ? 'sign-in' : 'sign-up';
    this.router.navigate([route], {
      relativeTo: this.activatedRoute.parent,
      queryParams: { email }
    })
  }

}