import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { RouterModule } from '@angular/router';
import { ConfirmationModalComponent } from '../../../components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-admin-reservations',
  imports: [
    RouterModule,
    DatePipe,
    NgClass,
    NgIf,
    NgFor,
    FormsModule,
    ConfirmationModalComponent,
  ],
  templateUrl: './admin-reservations.component.html',
  styleUrl: './admin-reservations.component.scss',
})
export class AdminReservationsComponent {
  reservations: any;

  page: number = 1;
  pageSize: number = 6;
  totalPages: number = 1;
  totalItems: number = 0;

  searchTerm = '';
  statusFilter: '' | 'pending' | 'confirmed' | 'canceled' = '';

  stats = {
    total: 0,
    confirmed: 0,
    pending: 0,
    canceled: 0,
  };

  loading = false;
  statsLoading = false;

  showCancelModal = false;
  selectedReservation: any = null;
  modalMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchReservations();
    this.fetchStats();
  }

  fetchReservations(): void {
    this.loading = true;

    const params = new URLSearchParams();
    params.set('page', String(this.page));
    params.set('pageSize', String(this.pageSize));

    if (this.searchTerm.trim())
      params.set('searchTerm', this.searchTerm.trim());
    if (this.statusFilter) params.set('status', this.statusFilter);

    this.apiService
      .get<any>(`reservations/search?${params.toString()}`, true)
      .subscribe({
        next: async (res) => {
          const rows = Array.isArray(res.data) ? res.data : [];

          const fetchRentals = rows.map(async (reservation: any) => {
            try {
              const listing = await firstValueFrom(
                this.apiService.get<any>(
                  `listings/${reservation.listingId}`,
                  true
                )
              );
              return {
                ...reservation,
                listingTitle: listing.title,
              };
            } catch {
              return {
                ...reservation,
                listingTitle: reservation.listingId,
              };
            }
          });

          this.reservations = await Promise.all(fetchRentals);

          this.totalItems = res.total ?? rows.length;
          this.totalPages = res.totalPages ?? 1;
          this.loading = false;

          this.fetchStats();
        },
        error: () => {
          this.reservations = [];
          this.totalItems = 0;
          this.totalPages = 1;
          this.loading = false;

          this.fetchStats();
        },
      });
  }

  fetchStats(): void {
    this.statsLoading = true;

    const params = new URLSearchParams();
    if (this.searchTerm.trim())
      params.set('searchTerm', this.searchTerm.trim());
    if (this.statusFilter) params.set('status', this.statusFilter);

    this.apiService
      .get<any>(`reservations/stats?${params.toString()}`, true)
      .subscribe({
        next: (res) => {
          this.stats = res || {
            total: 0,
            confirmed: 0,
            pending: 0,
            canceled: 0,
          };
          this.statsLoading = false;
        },
        error: () => {
          this.stats = { total: 0, confirmed: 0, pending: 0, canceled: 0 };
          this.statsLoading = false;
        },
      });
  }

  applyFilters(): void {
    this.page = 1;
    this.fetchReservations();
  }

  searchReservation() {
    this.applyFilters();
  }

  changePage(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.page = newPage;
    this.fetchReservations();
  }

  openCancelModal(reservation: any) {
    this.selectedReservation = reservation;
    this.modalMessage = `Are you sure you want to remove the reservation for "${reservation.fullName}" at "${reservation.listingTitle}"?`;
    this.showCancelModal = true;
  }

  cancelCancelModal() {
    this.showCancelModal = false;
    this.selectedReservation = null;
  }

  confirmRemove() {
    if (!this.selectedReservation) return;

    this.apiService
      .delete<any>(`reservations/${this.selectedReservation._id}`, true)
      .subscribe({
        next: () => {
          this.fetchReservations();
          this.showCancelModal = false;
          this.selectedReservation = null;
        },
        error: (err) => {
          console.error('Failed to cancel reservation', err);
          this.showCancelModal = false;
        },
      });
  }
}
