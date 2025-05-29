import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { UserSessionService } from '../../../services/user-session.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { PricingService } from '../../../services/pricing.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reserve-rental',
  imports: [NgIf, NgFor, NgClass, FormsModule],
  templateUrl: './reserve-rental.component.html',
  styleUrl: './reserve-rental.component.scss',
})
export class ReserveRentalComponent {
  rentalId!: string;
  rental: any = null;

  today: string = new Date().toISOString().split('T')[0];
  startDate!: string;
  endDate!: string;

  fullName: string = '';
  email: string = '';
  numberOfHours: number = 1;
  totalPrice: number = 0;
  paymentMethod: string = '';

  feedbackMessage: string = '';
  feedbackType: 'success' | 'error' | '' = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private pricingService: PricingService
  ) {}

  ngOnInit() {
    if (!UserSessionService.isLoggedIn()) {
      this.router.navigateByUrl('/auth/login');
      return;
    }

    this.startDate = this.today;

    this.rentalId = this.route.snapshot.paramMap.get('id')!;
    this.fetchRentalDetails(this.rentalId);
  }

  goBack() {
    this.router.navigate(['/rental', this.rentalId]);
  }

  fetchRentalDetails(id: string): void {
    this.apiService.get<any>(`listings/${id}`).subscribe({
      next: (data) => {
        this.rental = data;

        if (this.rental.priceType === 'hour') {
          this.numberOfHours = 1;
        }

        this.updateTotalPrice();
      },
      error: (err) => {
        console.error('Error fetching rental details:', err);
      },
    });
  }

  updateTotalPrice(): void {
    if (!this.rental) return;

    const { basePrice, priceType } = this.rental;

    // Hourly pricing uses a simple number field
    if (priceType === 'hour') {
      const amounts = this.pricingService.calculateTotalPrice(
        basePrice,
        this.numberOfHours
      );
      this.totalPrice = amounts.totalAmount;
      return;
    }

    // All other pricing types rely on date difference
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

      const durationInMilliseconds = end.getTime() - start.getTime();
      const durationInDays = Math.ceil(
        durationInMilliseconds / (1000 * 60 * 60 * 24)
      );

      let quantity = 1;

      switch (priceType) {
        case 'day':
          quantity = durationInDays;
          break;
        case 'week':
          quantity = Math.ceil(durationInDays / 7);
          break;
        case 'month':
          quantity = Math.ceil(durationInDays / 30);
          break;
        case 'year':
          quantity = Math.ceil(durationInDays / 365);
          break;
      }

      const amounts = this.pricingService.calculateTotalPrice(
        basePrice,
        quantity
      );
      this.totalPrice = amounts.totalAmount;
    }
  }

  getFinalPrice(basePrice: number): number {
    const amounts = this.pricingService.calculateTotalPrice(basePrice);
    return amounts.totalAmount;
  }

  preventTyping(event: KeyboardEvent): void {
    event.preventDefault();
  }

  submitReservation(): void {
    if (!this.rental) return;

    let quantity = 1;

    if (this.rental.priceType === 'hour') {
      quantity = this.numberOfHours;
    } else {
      if (!this.startDate || !this.endDate) {
        this.showFeedback('Start and End dates are required.', 'error');
        return;
      }

      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      const diffMs = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      switch (this.rental.priceType) {
        case 'day':
          quantity = diffDays;
          break;
        case 'week':
          quantity = Math.ceil(diffDays / 7);
          break;
        case 'month':
          quantity = Math.ceil(diffDays / 30);
          break;
        case 'year':
          quantity = Math.ceil(diffDays / 365);
          break;
      }
    }

    const amounts = this.pricingService.calculateTotalPrice(
      this.rental.basePrice,
      quantity
    );

    const payload: any = {
      listingId: this.rental._id,
      userId: UserSessionService.loadUser()._id,
      fullName: this.fullName,
      email: this.email,
      paymentMethod: this.paymentMethod,
      priceType: this.rental.priceType,
      startDate: this.startDate,
      ...amounts,
    };

    if (this.rental.priceType === 'hour') {
      payload.numberOfHours = this.numberOfHours;
    } else {
      payload.endDate = this.endDate;
    }

    this.apiService.post('reservations/add', payload, true).subscribe({
      next: (response) => {
        this.showFeedback('Reservation created successfully!', 'success');
        setTimeout(() => {
          this.router.navigate(['/rental', this.rental._id]);
        }, 2500);
      },
      error: (err) => {
        console.error('Error creating reservation:', err);
        const msg =
          err?.error.message === 'Listing is already reserved for these dates'
            ? 'This listing is already booked for the selected dates. Please choose different ones.'
            : 'Failed to create reservation. Please check your inputs and try again.';

        this.showFeedback(msg, 'error');
        this.resetForm();
      },
    });
  }

  showFeedback(message: string, type: 'success' | 'error') {
    this.feedbackMessage = message;
    this.feedbackType = type;
  }

  resetForm(): void {
    this.fullName = '';
    this.email = '';
    this.numberOfHours = 1;
    this.totalPrice = 0;
    this.paymentMethod = '';
    this.endDate = '';
  }
}
