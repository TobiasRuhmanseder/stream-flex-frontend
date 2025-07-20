import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SignInputComponent } from 'src/app/features/sign-input/sign-input.component';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, SignInputComponent ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private sharedService: SharedService) {
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(60), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)]],
      rememberMe: [false]
    })
    this.loginForm.controls['email'].setValue(this.checkExistingEmail());
  }

  // Getter for email as FormControl
  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  // Getter for password as FormControl
  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  login() {
    if (this.loginForm.valid) {
      // Backend 
      console.log(this.emailControl.value);

    }
  }
  // check if a email adress was put into the get stark input field on the landing page - übernehmen
  checkExistingEmail(): string {
    let email: string = this.sharedService.getIdentifier();
    if (email != '') return email;
    else return ''
  }
}
