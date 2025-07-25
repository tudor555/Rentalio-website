import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { NgIf } from '@angular/common';
import { UserSessionService } from '../../../services/user-session.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  error: string | null = null;

  constructor(private api: ApiService, private router: Router) {}

  login(form: NgForm) {
    if (form.invalid) {
      // Mark all as touched to show validation messages
      form.control.markAllAsTouched();
      return;
    }

    const credentials = {
      email: this.email,
      password: this.password,
    };

    this.api
      .post<{ token: string }>('auth/login', credentials, true)
      .subscribe({
        next: (res) => {
          UserSessionService.saveUser(res);

          // TODO: return the user to the page that was before login action
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.error = err?.error?.error || 'Login failed';
          console.error('Login error:', err);
        },
      });
  }
}
