import { Component } from '@angular/core';
import { UserSessionService } from '../../services/user-session.service';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgIf } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-become-owner',
  imports: [FormsModule, NgIf],
  templateUrl: './become-owner.component.html',
  styleUrl: './become-owner.component.scss',
})
export class BecomeOwnerComponent {
  agreeToTerms = false;
  showError = false;
  isSubmitting = false;

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    if (!UserSessionService.isLoggedIn()) {
      this.router.navigateByUrl('/auth/login');
      return;
    }
    if (UserSessionService.loadUser().role === 'owner') {
      this.router.navigateByUrl('/not-found');
      return;
    }
  }

  submitBecomeOwner() {
    if (!this.agreeToTerms) {
      this.showError = true;
      return;
    }

    this.showError = false;
    this.isSubmitting = true;

    const payload = { role: 'owner' };

    this.apiService
      .patch(
        `users/role-change/${UserSessionService.loadUser()._id}`,
        payload,
        true
      )
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (res) => {
          UserSessionService.saveUser(res);
          this.router.navigateByUrl('/rental/list-property');
        },
        error: (err) => {
          console.error('Failed to update role:', err);
          this.showError = true;
        },
      });
  }
}
