import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgClass, NgFor } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { firstValueFrom } from 'rxjs';
import { ConfirmationModalComponent } from '../../../components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterModule, NgFor, NgClass, ConfirmationModalComponent],
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

  showConfirmModal = false;
  modalTitle = '';
  modalMessage = '';
  modalAction: () => void = () => {};

  ngOnInit(): void {
    this.fetchUsers();

    this.fetchListings();

    this.fetchReservations();
  }

  fetchUsers() {
    this.apiService.get<any[]>('users', true).subscribe((users) => {
      this.users = users;
      this.totalUsers = users.length;
    });
  }

  fetchListings() {
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
  }

  fetchReservations() {
    this.apiService.get<any[]>('reservations').subscribe((reservations) => {
      this.totalReservations = reservations.length;

      const fetchRentals = reservations.map(async (res: any) => {
        try {
          const listing = await firstValueFrom(
            this.apiService.get<any>(`listings/${res.listingId}`, true)
          );
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

  openUserRemoveModal(userId: string) {
    this.modalTitle = 'Remove User';
    this.modalMessage = `Are you sure you want to remove user with ID: ${userId}?`;
    this.modalAction = () => this.removeUser(userId);
    this.showConfirmModal = true;
  }

  removeUser(userId: string) {
    this.apiService.delete(`users/${userId}`, true).subscribe({
      next: () => {
        this.showConfirmModal = false;
        this.fetchUsers();
      },
      error: (err) => {
        console.error('Failed to delete user:', err);
      },
    });
  }

  openListingRemoveModal(listingId: string) {
    this.modalTitle = 'Remove Listing';
    this.modalMessage = `Are you sure you want to remove listing with ID: ${listingId}?`;
    this.modalAction = () => this.removeListing(listingId);
    this.showConfirmModal = true;
  }

  removeListing(listingId: string) {
    this.apiService.delete(`listings/${listingId}`, true).subscribe({
      next: () => {
        this.showConfirmModal = false;
        this.fetchListings();
      },
      error: (err) => {
        console.error('Failed to delete reservation:', err);
      },
    });
  }

  openReservationCancelModal(reservationId: string) {
    this.modalTitle = 'Cancel Reservation';
    this.modalMessage = `Are you sure you want to cancel reservation ${reservationId}?`;
    this.modalAction = () => this.removeReservation(reservationId);
    this.showConfirmModal = true;
  }

  removeReservation(reservationId: string) {
    this.apiService.delete(`reservations/${reservationId}`, true).subscribe({
      next: () => {
        this.showConfirmModal = false;
        this.fetchReservations();
      },
      error: (err) => {
        console.error('Failed to delete reservation:', err);
      },
    });
  }

  confirmModalAction() {
    this.modalAction();
    this.showConfirmModal = false;
  }

  cancelModal() {
    this.showConfirmModal = false;
  }
}
