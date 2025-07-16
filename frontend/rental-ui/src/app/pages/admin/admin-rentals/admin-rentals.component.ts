import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgClass, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { PricingService } from '../../../services/pricing.service';
import { ConfirmationModalComponent } from '../../../components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-admin-rentals',
  imports: [
    RouterModule,
    NgClass,
    NgFor,
    FormsModule,
    ConfirmationModalComponent,
  ],
  templateUrl: './admin-rentals.component.html',
  styleUrl: './admin-rentals.component.scss',
})
export class AdminRentalsComponent {
  listings: any[] = [];

  page: number = 1;
  pageSize: number = 8;
  totalPages: number = 1;
  totalItems: number = 0;

  searchTitle: string = '';

  selectedListing: any = null;
  showConfirmModal: boolean = false;
  modalTitle: string = '';
  confirmMessage: string = '';

  constructor(
    private apiService: ApiService,
    private pricingService: PricingService
  ) {}

  ngOnInit(): void {
    this.fetchListings();
  }

  fetchListings(title: string = '') {
    const params = new URLSearchParams();
    params.set('sort', 'createdAt_desc');
    params.set('page', this.page.toString());
    params.set('pageSize', this.pageSize.toString());
    if (title.trim()) {
      params.set('title', title.trim());
    }

    this.apiService
      .get<any>(`listings/search?${params.toString()}`)
      .subscribe(async (response) => {
        const listingsData = Array.isArray(response.data) ? response.data : [];

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

        this.listings = enrichedListings.map((listing) => {
          const pricing = this.pricingService.calculateTotalPrice(
            listing.basePrice
          );
          return { ...listing, pricing };
        });

        this.totalPages = response.totalPages || 1;
        this.totalItems = response.total || 0;
      });
  }

  changePage(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.page = newPage;
    this.fetchListings(this.searchTitle);
  }

  searchByTitle() {
    this.page = 1; // Reset to first page on new search
    this.fetchListings(this.searchTitle);
  }

  openRemoveModal(listing: any) {
    this.selectedListing = listing;
    this.modalTitle = 'Remove Listing';
    this.confirmMessage = `Are you sure you want to delete rental "${listing.title}"?`;
    this.showConfirmModal = true;
  }

  cancelRemove() {
    this.selectedListing = null;
    this.showConfirmModal = false;
  }

  confirmRemove() {
    if (!this.selectedListing) return;

    this.apiService
      .delete(`listings/${this.selectedListing._id}`, true)
      .subscribe({
        next: () => {
          this.showConfirmModal = false;
          this.fetchListings();
        },
        error: (err) => {
          console.error('Failed to delete reservation:', err);
        },
      });
  }
}
