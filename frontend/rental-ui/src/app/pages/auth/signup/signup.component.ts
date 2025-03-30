import { Component } from '@angular/core';

@Component({
  selector: 'app-signup',
  imports: [],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  onPhoneInput(event: any) {
    const input = event.target;
    // Replace non-digit characters with empty string
    input.value = input.value.replace(/\D/g, '');
  }
}
