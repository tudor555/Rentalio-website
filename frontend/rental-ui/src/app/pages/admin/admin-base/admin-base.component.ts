import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin',
  imports: [RouterModule],
  templateUrl: './admin-base.component.html',
  styleUrl: './admin-base.component.scss',
})
export class AdminComponent implements OnInit {
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
