import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserSessionService } from '../../services/user-session.service';
import { ApiService } from '../../services/api.service';
import { CookieUtil } from '../../services/cookie.service';

@Component({
  selector: 'app-change-password',
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  userEmail: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  // Email pattern regex for validation (simple check for email format like 'email@example.com')
  emailPattern: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    if (!UserSessionService.isLoggedIn()) {
      this.router.navigateByUrl('/auth/login');
      return;
    }
  }

  changePassword(form: NgForm) {
    // Check if form is valid before proceeding
    if (form.invalid) {
      this.errorMessage = 'Please fill out all fields correctly.';
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
      return;
    }

    const body = {
      email: this.userEmail.trim(),
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
    };

    this.api
      .patch(`users/${UserSessionService.loadUser()._id}/password`, body, true)
      .subscribe({
        next: (res) => {
          this.successMessage = 'Password updated successfully!';
          setTimeout(() => {
            UserSessionService.clearUser();
            CookieUtil.deleteCookie('USER-AUTH');
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Password change failed';
          console.error('Change password error:', err);
        },
      });
  }
}
