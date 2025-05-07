import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { SignInputComponent } from 'src/app/features/sign-input/sign-input.component';
import { SharedService } from 'src/app/services/shared.service';

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [ReactiveFormsModule, SignInputComponent],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private sharedService: SharedService) {
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required, this.emailOrPhoneValidator]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]]
    })
    this.loginForm.controls['identifier'].setValue(this.checkExistingIdentifier());
  }

  // Getter for identifier as FormControl
  get identifierControl(): FormControl {
    return this.loginForm.get('identifier') as FormControl;
  }

  // Getter for password as FormControl
  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  emailOrPhoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?\d{10,15}$/;
    const isValidEmail = emailPattern.test(value);
    const isValidPhone = phonePattern.test(value);
    if (!isValidEmail && !isValidPhone) {
      return { invalidIdentifier: true };
    }
    return null;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Backend 
    }
  }

  checkExistingIdentifier(): string {
    let identifier: string = this.sharedService.getIdentifier();
    if (identifier != '') return identifier;
    else return ''
  }
}
