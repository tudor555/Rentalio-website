import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserSessionService } from '../../../services/user-session.service';
import { CookieUtil } from '../../../services/cookie.service';
import { ConfirmationModalComponent } from "../../../components/confirmation-modal/confirmation-modal.component";

@Component({
  selector: 'app-admin',
  imports: [RouterModule, ConfirmationModalComponent],
  templateUrl: './admin-base.component.html',
  styleUrl: './admin-base.component.scss',
})
export class AdminComponent {
  showLogoutModal: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (!UserSessionService.isAdmin()) {
      this.router.navigateByUrl('/not-found');
      return;
    }
  }

  triggerLogoutConfirmation() {
    this.showLogoutModal = true;
  }

  confirmLogout() {
    UserSessionService.clearUser();
    CookieUtil.deleteCookie('USER-AUTH');
    this.router.navigate(['/home']);
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }
}
