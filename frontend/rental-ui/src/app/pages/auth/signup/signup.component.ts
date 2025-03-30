import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  constructor(private route: Router) {}

  onPhoneInput(event: any) {
    const input = event.target;
    // Replace non-digit characters with empty string
    input.value = input.value.replace(/\D/g, '');
  }

  signup() {
    this.route.navigate(['/home']); // Redirect to home page after signup
  }
}
