import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  private apiService = inject(ApiService);
  totalUsers = 0;
  totalListings = 0;
  totalReservations = 0;

  ngOnInit(): void {
    this.apiService.get<any[]>('users').subscribe((users) => {
      this.totalUsers = users.length;
    });

    this.apiService.get<any[]>('listings').subscribe((listings) => {
      this.totalListings = listings.length;
    });

    this.apiService.get<any[]>('reservations').subscribe((reservations) => {
      this.totalReservations = reservations.length;
    });
  }
}
