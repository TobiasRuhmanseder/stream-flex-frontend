import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

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
}