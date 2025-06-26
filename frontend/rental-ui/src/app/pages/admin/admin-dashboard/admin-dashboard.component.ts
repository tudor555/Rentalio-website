import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgClass, NgFor } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterModule, NgFor, NgClass],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
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

    this.apiService
      .get<any>('listings/search?sort=createdAt_desc')
      .subscribe(async (listings) => {
        this.totalListings = listings.total;

        const listingsData = Array.isArray(listings.data) ? listings.data : [];

        const enrichedListings = await Promise.all(
          listingsData.map(async (listing: any) => {
            try {
              const owner = await firstValueFrom(
                this.apiService.get<any>(`users/${listing.ownerId}`, true)
              );
              return {
                ...listing,
                ownerName: owner.username || owner.email || listing.ownerId,
              };
            } catch {
              return {
                ...listing,
                ownerName: listing.ownerId,
              };
            }
          })
        );

        this.listings = enrichedListings;
      });

    this.apiService.get<any[]>('reservations').subscribe((reservations) => {
      this.totalReservations = reservations.length;

      const fetchRentals = reservations.map(async (res: any) => {
        try {
          const listing = await this.apiService
            .get<any>(`listings/${res.listingId}`, true)
            .toPromise();
          return {
            ...res,
            listingTitle: listing.title,
          };
        } catch {
          return {
            ...res,
            listingTitle: res.listingId,
          };
        }
      });

      Promise.all(fetchRentals).then((results) => {
        this.reservations = results;
      });
    });
  }
}
