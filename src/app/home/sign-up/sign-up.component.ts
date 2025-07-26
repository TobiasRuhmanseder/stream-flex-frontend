import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { delay, switchMap, tap } from 'rxjs';
import { SignInputComponent } from 'src/app/features/sign-input/sign-input.component';
import { AuthService } from 'src/app/services/auth.service';
import { RecaptchaService } from 'src/app/services/recaptcha.service';
import { NotificationSignalsService } from 'src/app/services/notification-signals.service';
import { Router } from '@angular/router';
import { SignUpResponse } from 'src/app/models/user.interfaces';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, SignInputComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private recaptchaService: RecaptchaService, private authService: AuthService, private notificationService: NotificationSignalsService) {
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(60), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)]],
    })
    this.signupForm.controls['email'].setValue(this.getEmailFromLetsGoInput());
  }

  // Getter for identifier as FormControl
  get emailControl(): FormControl {
    return this.signupForm.get('email') as FormControl;
  }

  // Getter for password as FormControl
  get passwordControl(): FormControl {
    return this.signupForm.get('password') as FormControl;
  }

  signup() {
    if (this.signupForm.invalid) return
    const email = this.emailControl.value
    const password = this.passwordControl.value

    this.recaptchaService.getToken('signup')
      .pipe(
        switchMap(token => this.authService.signUp({ email, password, recaptchaToken: token })),
        tap((resp: SignUpResponse) => {
          this.notificationService.show({ type: 'success', message: `${resp.email} was created successfully ` });
        }),
        delay(2000)
      ).subscribe((resp: SignUpResponse) => {
        this.router.navigate(['/sign-up-success'])
      })
  }

  getEmailFromLetsGoInput(): string {
    const paramEmail = this.route.snapshot.queryParamMap.get('email') || '';
    return paramEmail
  }
}


