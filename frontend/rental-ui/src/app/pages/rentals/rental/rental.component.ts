import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { PricingService } from '../../../services/pricing.service';

@Component({
  selector: 'app-rental',
  imports: [CommonModule, RouterModule],
  templateUrl: './rental.component.html',
  styleUrl: './rental.component.scss',
})
export class RentalComponent {
  rental: any = null;
  rentalId: string = '';
  currentImageIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private pricingService: PricingService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.rentalId = id;
      this.fetchRentalDetails(id);
    }
  }

  fetchRentalDetails(id: string): void {
    this.apiService.get<any>(`listings/${id}`).subscribe({
      next: (data) => {
        this.rental = data;
      },
      error: (err) => {
        console.error('Error fetching rental details:', err);
      },
    });
  }

  getFinalPrice(basePrice: number): number {
    const amounts = this.pricingService.calculateTotalPrice(basePrice);
    return amounts.totalAmount;
  }

  prevImage(): void {
    if (!this.rental?.images?.length) return;
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.rental.images.length) %
      this.rental.images.length;
  }

  nextImage(): void {
    if (!this.rental?.images?.length) return;
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.rental.images.length;
  }

  goToImage(index: number): void {
    this.currentImageIndex = index;
  }

  capitalizeWords(text: string): string {
    if (!text) return '';
    return text
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
