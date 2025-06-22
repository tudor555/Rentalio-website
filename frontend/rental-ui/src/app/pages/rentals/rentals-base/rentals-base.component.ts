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

  page: number = 1;
  pageSize: number = 6;
  totalPages: number = 1;

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
    const params = new URLSearchParams();
    params.set('page', this.page.toString());
    params.set('pageSize', this.pageSize.toString());

    this.apiService.get<any>(`listings/search?${params.toString()}`).subscribe({
      next: (response) => {
        this.rentals = of(response.data);
        this.totalPages = response.totalPages;
      },
      error: (err) => {
        console.error('Error fetching rentals:', err);
      },
    });
  }

  getFinalPrice(basePrice: number): number {
    const amounts = this.pricingService.calculateTotalPrice(basePrice);
    return amounts.totalAmount;
  }

  searchByTitle() {
    this.page = 1;
    const params = new URLSearchParams();
    if (this.searchTitle.trim()) {
      params.set('title', this.searchTitle.trim());
    }
    params.set('page', this.page.toString());
    params.set('pageSize', this.pageSize.toString());

    this.apiService.get<any>(`listings/search?${params.toString()}`).subscribe({
      next: (response) => {
        this.rentals = of(response.data);
        this.totalPages = response.totalPages;
      },
      error: (err) => {
        console.error('Error fetching rental details:', err);
      },
    });
  }

  applyFilters(resetPage: boolean = true): void {
    if (resetPage) this.page = 1;

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
    params.set('page', this.page.toString());
    params.set('pageSize', this.pageSize.toString());

    this.apiService.get<any>(`listings/search?${params.toString()}`).subscribe({
      next: (response) => {
        this.rentals = of(response.data);
        this.totalPages = response.totalPages;
      },
      error: (err) => {
        console.error('Error fetching filtered rentals:', err);
      },
    });
  }

  changePage(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.page = newPage;

    const hasFilters =
      this.searchTitle.trim() ||
      this.filter.location ||
      this.filter.priceMin !== null ||
      this.filter.priceMax !== null ||
      this.filter.propertyType ||
      this.filter.sort;

    if (hasFilters) {
      this.applyFilters(false); // don't reset page
    } else {
      this.fetchRentals();
    }
  }
}
