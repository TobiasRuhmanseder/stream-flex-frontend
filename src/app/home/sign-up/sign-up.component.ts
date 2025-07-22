import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SignInputComponent } from 'src/app/features/sign-input/sign-input.component';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, SignInputComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(60), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)]],
    })
    this.signupForm.controls['email'].setValue(this.  getEmailFromLetsGoInput()); 
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
    if (this.signupForm.valid) {
      // Backend 
    }
  }

  getEmailFromLetsGoInput(): string {
    const paramEmail = this.route.snapshot.queryParamMap.get('email') || '';
    return paramEmail
  }
}


