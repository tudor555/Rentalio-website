import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserSessionService } from '../../../services/user-session.service';

@Component({
  selector: 'app-admin',
  imports: [RouterModule],
  templateUrl: './admin-base.component.html',
  styleUrl: './admin-base.component.scss',
})
export class AdminComponent {
  constructor(private router: Router) {}

  ngOnInit(): void {
    if (!UserSessionService.isAdmin()) {
      this.router.navigateByUrl('/not-found');
      return;
    }
  }
}
