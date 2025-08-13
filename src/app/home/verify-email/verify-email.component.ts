import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { EMPTY, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  success = signal(false);
  notActivated = signal(false);
  resend= signal(false);
  email = signal('');

  constructor(private route: ActivatedRoute, private authService: AuthService) { }


  ngOnInit(): void {
    const qp = this.route.snapshot.queryParamMap;
    const token = qp.get('token');
    const email = qp.get('email');
    const notActivated = qp.get('notActivated');
    console.log(email);
    

    if (email) this.email.set(email);

    if (!token) {
      this.success.set(false);
      if (notActivated) this.notActivated.set(true);
      return;
    }
    this.authService.verifyEmail(token).pipe(
      catchError(() => {
        this.success.set(false);
        return EMPTY;
      })
    ).subscribe(() => {
      this.success.set(true);
    });
  }

  resendVerification() {
    if (!(this.email() === '')) {
      console.log(true);
      
      this.authService.resendVerificaton(this.email()).subscribe(() => {
        this.resend.set(true);
        this.notActivated.set(false);
      })
    }

  }
}
