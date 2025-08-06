import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sign-up-success',
  imports: [RouterLink],
  templateUrl: './sign-up-success.component.html',
  styleUrl: './sign-up-success.component.scss'
})
export class SignUpSuccessComponent implements OnInit {
  public email: String = '';


  constructor(private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.email = this.getEmailFromUrl();

  }

  getEmailFromUrl(): string {
    const paramEmail = this.route.snapshot.queryParamMap.get('email') || '';
    return paramEmail
  }
}
