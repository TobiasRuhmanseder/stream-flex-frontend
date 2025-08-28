import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from 'src/app/i18n/translate.pipe';

@Component({
  selector: 'app-sign-up-success',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './sign-up-success.component.html',
  styleUrl: './sign-up-success.component.scss'
})
/**
 * Component shown after successful sign-up.
 * Displays the email used for sign-up.
 */
export class SignUpSuccessComponent implements OnInit {
  public email: string = '';

  constructor(private route: ActivatedRoute) { }

  /**
   * Initialize the component.
   * Gets the email from the URL query parameters.
   */
  ngOnInit(): void {
    this.email = this.getEmailFromUrl();
  }

  /**
   * Get the email value from the URL query parameters.
   * @returns The email as a string.
   */
  getEmailFromUrl(): string {
    const paramEmail = this.route.snapshot.queryParamMap.get('email') || '';
    return paramEmail
  }
}
