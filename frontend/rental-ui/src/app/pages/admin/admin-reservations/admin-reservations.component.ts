import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { RouterModule } from '@angular/router';
import { PricingService } from '../../../services/pricing.service';
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
  // ─── State Variables ───
  reservations: any;

  // Pagination
  page: number = 1;
  pageSize: number = 6;
  totalPages: number = 1;
  totalItems: number = 0;

  // Filters
  searchTerm = '';
  statusFilter: '' | 'pending' | 'confirmed' | 'canceled' = '';

  // Stats
  stats = {
    total: 0,
    confirmed: 0,
    pending: 0,
    canceled: 0,
  };

  // UI State
  loading = false;
  statsLoading = false;
  showCancelModal = false;
  showEditModal = false;

  // Modals
  selectedReservation: any = null;
  modalMessage = '';
  editReservation: any = null;

  // Helpers
  today: string = new Date().toISOString().split('T')[0];
  errorMessage: string | null = null;

  constructor(
    private apiService: ApiService,
    private pricingService: PricingService
  ) {}

  ngOnInit(): void {
    this.fetchReservations();
    this.fetchStats();
  }

  // ─── Fetching Data ───
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
                basePrice: listing.basePrice,
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

  // Fetch stats for reservations
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

  // ─── Filtering & Pagination ───
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

  // ─── Cancel Reservation ───
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

  // ─── Edit Reservation ───
  openEditModal(reservation: any) {
    this.editReservation = {
      ...reservation,
      _original: reservation, // keep reference for comparison
      startDate: reservation.startDate
        ? this.formatDateForInput(reservation.startDate, reservation.priceType)
        : '',
      endDate: reservation.endDate
        ? this.formatDateForInput(reservation.endDate, reservation.priceType)
        : '',
      numberOfHours: reservation.numberOfHours || 1,
      basePrice: reservation.basePrice,
    };

    // Prefill the price on opening
    this.recalculatePrice();

    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editReservation = null;
  }

  saveReservation() {
    if (!this.editReservation) return;

    const now = new Date();
    const start = new Date(this.editReservation.startDate);

    // Validate only if changed
    if (
      this.editReservation.startDate !== this.selectedReservation?.startDate ||
      this.editReservation.endDate !== this.selectedReservation?.endDate ||
      this.editReservation.numberOfHours !==
        this.selectedReservation?.numberOfHours
    ) {
      if (this.editReservation.priceType === 'hour') {
        if (start < now) {
          this.errorMessage = 'Date cannot be in the past.';
          return;
        }
        if (
          !this.editReservation.numberOfHours ||
          this.editReservation.numberOfHours < 1
        ) {
          this.errorMessage = 'Number of hours must be at least 1.';
          return;
        }
      } else {
        const end = new Date(this.editReservation.endDate);

        if (start < now) {
          this.errorMessage = 'Check-in cannot be in the past.';
          return;
        }
        if (end <= start) {
          this.errorMessage = 'Check-out must be after check-in.';
          return;
        }
      }
    }

    // Build update object
    const updates: any = {
      status: this.editReservation.status,
      startDate: this.editReservation.startDate,
    };

    if (this.editReservation.priceType === 'hour') {
      updates.numberOfHours = this.editReservation.numberOfHours;
    } else {
      updates.endDate = this.editReservation.endDate;
    }

    // Always include recalculated pricing
    updates.ownerAmount = this.editReservation.ownerAmount;
    updates.siteFee = this.editReservation.siteFee;
    updates.totalAmount = this.editReservation.totalAmount;

    this.apiService
      .patch(`reservations/${this.editReservation._id}`, updates, true)
      .subscribe({
        next: () => {
          this.fetchReservations();
          this.closeEditModal();
        },
        error: (err) => console.error('Failed to update reservation', err),
      });
  }

  // ─── Helpers ───
  preventTyping(event: KeyboardEvent): void {
    event.preventDefault();
  }

  private formatDateForInput(dateStr: string, priceType: string): string {
    const date = new Date(dateStr);
    return priceType === 'hour'
      ? date.toISOString().split('T')[0] // yyyy-MM-dd (no time)
      : date.toISOString().split('T')[0];
  }

  //  Recalculate pricing based on priceType (hour, day, week, month, year)
  recalculatePrice(): void {
    if (!this.editReservation?.basePrice) return;

    let quantity = 1;

    const start = this.editReservation.startDate
      ? new Date(this.editReservation.startDate + 'T00:00:00')
      : null;
    const end = this.editReservation.endDate
      ? new Date(this.editReservation.endDate + 'T00:00:00')
      : null;

    switch (this.editReservation.priceType) {
      case 'hour':
        quantity = this.editReservation.numberOfHours || 1;
        break;

      case 'day':
        if (start && end && end > start) {
          const diffTime = Math.abs(end.getTime() - start.getTime());
          quantity = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // days
        }
        break;

      case 'week':
        if (start && end && end > start) {
          const diffTime = Math.abs(end.getTime() - start.getTime());
          quantity = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7)); // weeks
        }
        break;

      case 'month':
        if (start && end && end > start) {
          quantity =
            (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth());
          if (end.getDate() > start.getDate()) {
            quantity += 1;
          }
          quantity = Math.max(quantity, 1); // at least 1 month
        }
        break;

      case 'year':
        if (start && end && end > start) {
          quantity = end.getFullYear() - start.getFullYear();
          if (
            end.getMonth() > start.getMonth() ||
            (end.getMonth() === start.getMonth() &&
              end.getDate() > start.getDate())
          ) {
            quantity += 1;
          }
          quantity = Math.max(quantity, 1); // at least 1 year
        }
        break;
    }

    const pricing = this.pricingService.calculateTotalPrice(
      this.editReservation.basePrice,
      quantity
    );

    this.editReservation.ownerAmount = pricing.ownerAmount;
    this.editReservation.siteFee = pricing.siteFee;
    this.editReservation.totalAmount = pricing.totalAmount;
  }
}
