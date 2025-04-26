import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { UserSessionService } from '../../services/user-session.service';

@Component({
  selector: 'app-profile',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  user: any = null;
  fullName: string = '';
  email: string = '';
  phone: string = '';
  message: string = '';
  isError: boolean = false;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    const userLoogedIn = UserSessionService.isLoggedIn();

    if (!userLoogedIn) {
      this.router.navigateByUrl('/not-found');
      return;
    }

    const userData = UserSessionService.loadUser();

    this.api.get<any>(`users/${userData._id}`, true).subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
        // Optionally clear invalid session & redirect
        UserSessionService.clearUser();
        this.router.navigateByUrl('/not-found');
      },
    });
  }

  updateProfile() {
    const payload: any = {};

    if (this.fullName.trim()) {
      payload.username = this.fullName.trim();
    }
    if (this.email.trim()) {
      payload.email = this.email.trim();
    }
    if (this.phone.trim()) {
      payload.phone = this.phone.trim();
    }

    if (Object.keys(payload).length === 0) {
      this.message = 'Please fill at least one field to update.';
      this.isError = true;
      setTimeout(() => {
        this.message = '';
      }, 3000);
      return;
    }

    this.api.patch(`users/${this.user._id}`, payload, true).subscribe({
      next: () => {
        this.message = 'Profile updated successfully!';
        this.isError = false;
        this.fullName = '';
        this.email = '';
        this.phone = '';

        setTimeout(() => {
          this.message = '';
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        this.message = err?.error?.message || 'Failed to update profile.';
        this.isError = true;

        setTimeout(() => {
          this.message = '';
        }, 3000);
      },
    });
  }

  get profilePicture(): string {
    return this.user?.profilePicture && this.user.profilePicture !== 'null'
      ? this.user.profilePicture
      : 'assets/avatar-icon.jpg';
  }
}
