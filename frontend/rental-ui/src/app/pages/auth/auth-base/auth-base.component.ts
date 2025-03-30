import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [RouterLink, RouterOutlet, NgClass],
  templateUrl: './auth-base.component.html',
  styleUrl: './auth-base.component.scss',
})
export class AuthComponent {
  signup: boolean = false; // Flag to check if the user is on the signup page
  login: boolean = true; // Flag to check if the user is on the login page
  currentYear: number = new Date().getFullYear();

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.signup = event.url.includes('/auth/signup');
        this.login = event.url.includes('/auth/login');
      }
    });
  }
}
