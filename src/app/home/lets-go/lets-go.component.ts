import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { SignInputComponent } from 'src/app/features/sign-input/sign-input.component';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
    selector: 'app-lets-go',
    standalone: true,
    imports: [FormsModule, SignInputComponent],
    templateUrl: './lets-go.component.html',
    styleUrl: './lets-go.component.scss'
})
export class LetsGoComponent {
  emailControl = new FormControl<string>('', {
    validators: [Validators.required, Validators.email],
    nonNullable: true
  });

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private sharedService: SharedService) {
  }

  letsGo() {
    if (this.emailControl.valid) {
      //Backend request if email or adress exist 
      this.sharedService.setIdentifier(this.emailControl.value)
      this.router.navigate(['sign-in'], { relativeTo: this.activatedRoute.parent });
    }
  }
}
