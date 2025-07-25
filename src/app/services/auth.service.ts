import { Injectable } from '@angular/core';
import { CheckEmailResponse, SignUpRequest, CheckEmailRequest, SignUpResponse } from '../models/user.interfaces';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private base = environment.apiBaseUrl;         // z.B. 'http://localhost:8000/api'
  private signUpUrl = `${this.base}/users/signup/`;
  private emailExistUrl = `${this.base}/users/check-email/`;

  constructor(private http: HttpClient) { }

  firstRequestForAlwaysLoggedIn(): Promise<void> {
    return new Promise((resolve) => {
      // Simulate an API call to check if the user is logged in
      setTimeout(() => {
        // Here you would typically check if the user is logged in
        // For this example, we assume the user is always logged in
        resolve();
      }, 1000); // Simulating a delay of 1 second
    });
  }

  signUp(data: SignUpRequest): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(this.signUpUrl, data)
  }

  signIn() {

  }

  logout() {

  }

  checkEmailExist(data: CheckEmailRequest): Observable<CheckEmailResponse> {
    return this.http.post<CheckEmailResponse>(this.emailExistUrl, data);
  }

  getJwtToken(): string {
    return ''
  }

  refreshJwtToken(): Observable<any> {
    return this.http.post<CheckEmailResponse>(this.emailExistUrl, ''); //dummy
  }
}