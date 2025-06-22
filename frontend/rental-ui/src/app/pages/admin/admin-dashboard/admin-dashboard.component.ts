import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterModule, NgFor, NgClass],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  private apiService = inject(ApiService);
  totalUsers = 0;
  totalListings = 0;
  totalReservations = 0;

  users: any[] = [];
  listings: any[] = [];
  reservations: any[] = [];

  ngOnInit(): void {
    this.apiService.get<any[]>('users', true).subscribe((users) => {
      this.users = users;
      this.totalUsers = users.length;
    });

    this.apiService.get<any>('listings/search?sort=createdAt_desc').subscribe((listings) => {
      this.listings = listings.data || [];
      console.log(listings);
      this.totalListings = listings.total;
    });

    this.apiService.get<any[]>('reservations').subscribe((reservations) => {
      this.reservations = reservations;
      this.totalReservations = reservations.length;
    });
  }
}
