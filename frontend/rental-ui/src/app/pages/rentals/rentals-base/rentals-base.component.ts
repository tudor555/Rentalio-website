import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Observable, of } from 'rxjs';
import { UserSessionService } from '../../../services/user-session.service';
import { FormsModule } from '@angular/forms';
import { PricingService } from '../../../services/pricing.service';

@Component({
  selector: 'app-rental',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './rentals-base.component.html',
  styleUrls: ['./rentals-base.component.scss'],
})
export class RentalsComponent {
  isLoggedIn: boolean = UserSessionService.isLoggedIn();
  rentals: Observable<any[]> = of([]);
  searchTitle: string = '';

  priceError: string = '';

  filter = {
    sort: '',
    location: '',
    priceMin: null as number | null,
    priceMax: null as number | null,
    propertyType: '',
  };

  propertyTypes = [
    { value: '', label: 'All Types' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'playground', label: 'Playground' },
    { value: 'football_field', label: 'Football Field' },
    { value: 'tennis_field', label: 'Tennis Field' },
    { value: 'office', label: 'Office' },
    { value: 'other', label: 'Other' },
  ];

  constructor(
    private apiService: ApiService,
    private pricingService: PricingService
  ) {
    this.fetchRentals();
  }

  fetchRentals(): void {
    this.rentals = this.apiService.get<any>('listings');
  }

  getFinalPrice(basePrice: number): number {
    const amounts = this.pricingService.calculateTotalPrice(basePrice);
    return amounts.totalAmount;
  }

  searchByTitle() {
    const trimmedTitle = this.searchTitle.trim();

    if (!trimmedTitle) {
      // If empty, fetch all listings
      this.fetchRentals();
      return;
    }

    this.apiService
      .get<any>(`listings/search?title=${trimmedTitle}`)
      .subscribe({
        next: (data) => {
          this.rentals = of(data);
        },
        error: (err) => {
          console.error('Error fetching rental details:', err);
        },
      });
  }

  applyFilters(): void {
    if (
      this.filter.priceMin !== null &&
      this.filter.priceMax !== null &&
      this.filter.priceMin > this.filter.priceMax
    ) {
      this.priceError = 'Minimum price cannot be greater than maximum price.';
      return;
    } else {
      this.priceError = '';
    }

    const params = new URLSearchParams();

    if (this.searchTitle.trim()) {
      params.append('title', this.searchTitle.trim());
    }
    if (this.filter.location) {
      params.append('city', this.filter.location);
    }
    if (this.filter.priceMin !== null) {
      params.append('priceMin', this.filter.priceMin.toString());
    }
    if (this.filter.priceMax !== null) {
      params.append('priceMax', this.filter.priceMax.toString());
    }
    if (this.filter.propertyType) {
      params.append('category', this.filter.propertyType);
    }
    if (this.filter.sort) {
      params.append('sort', this.filter.sort);
    }

    const query = params.toString();

    this.apiService.get<any>(`listings/search?${query}`).subscribe({
      next: (data) => {
        this.rentals = of(data);
      },
      error: (err) => {
        console.error('Error fetching filtered rentals:', err);
      },
    });
  }
}
