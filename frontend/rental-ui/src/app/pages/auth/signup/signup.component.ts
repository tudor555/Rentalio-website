import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, NgIf],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  phone = '';
  agreedToTerms = false;
  error: string | null = null;

  constructor(private api: ApiService, private router: Router) {}

  signup(form: NgForm) {
    if (form.invalid) {
      // Mark all as touched to show validation messages
      form.control.markAllAsTouched();
      return;
    }

    const payload = {
      username: this.username,
      email: this.email,
      password: this.password,
      phone: this.phone,
      role: 'visitor',
    };

    this.api.post('auth/register', payload).subscribe({
      next: () => {
        this.error = null;
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.error = err?.error?.error || 'Signup failed.';
      },
    });
  }
}
