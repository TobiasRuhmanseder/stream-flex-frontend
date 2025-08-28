import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { EMPTY, catchError, throwError } from 'rxjs';
import { TranslatePipe } from 'src/app/i18n/translate.pipe';

/**
 * This component handles email verification after sign-up.
 */
@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  success = signal(false);
  notActivated = signal(false);
  resend = signal(false);
  email = signal('');

  constructor(private route: ActivatedRoute, private authService: AuthService) { }


  /**
   * Loads query parameters and triggers email verification if a token is provided.
   */
  ngOnInit(): void {
    const qp = this.route.snapshot.queryParamMap;
    const token = qp.get('token');
    const email = qp.get('email');
    const notActivated = qp.get('notActivated');
    if (email) this.email.set(email);
    if (!token) {
      this.success.set(false);
      if (notActivated) this.notActivated.set(true);
      return;
    }
    this.verifyEmail(token)
  }


  /**
   * Calls the backend to verify the token and updates the success state.
   * @param token The verification token received from the query parameters.
   */
  verifyEmail(token: string) {
    this.authService.verifyEmail(token).pipe(
      catchError(() => {
        this.success.set(false);
        return EMPTY;
      })
    ).subscribe(() => {
      this.success.set(true);
    });
  }


  /**
   * Sends a request to resend the verification email if an email address is present.
   */
  resendVerification() {
    if (!(this.email() === '')) {

      this.authService.resendVerificaton(this.email()).subscribe(() => {
        this.resend.set(true);
        this.notActivated.set(false);
      })
    }

  }
}
