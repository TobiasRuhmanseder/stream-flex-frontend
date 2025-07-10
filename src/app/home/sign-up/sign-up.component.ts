import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { SignInputComponent } from 'src/app/features/sign-input/sign-input.component';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, SignInputComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder, private sharedService: SharedService) {
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(60), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)]],
      rememberMe: [false]
    })
    this.signupForm.controls['email'].setValue(this.checkExistingEmail());
  }

  // Getter for identifier as FormControl
  get emailControl(): FormControl {
    return this.signupForm.get('identifier') as FormControl;
  }

  // Getter for password as FormControl
  get passwordControl(): FormControl {
    return this.signupForm.get('password') as FormControl;
  }

  signup() {
    if (this.signupForm.valid) {
      // Backend 
    }
  }

  // check if a email adress was put into the get start input field on the landing page - übernehmen
  checkExistingEmail(): string {
    let email: string = this.sharedService.getIdentifier();
    if (email != '') return email;
    else return ''
  }
}


