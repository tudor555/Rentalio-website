import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private router: Router) {}

  login() {
    // Implement your login logic here
    this.router.navigate(['/home']); // Redirect to home page after login
  }
}
