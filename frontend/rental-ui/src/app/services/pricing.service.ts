import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PricingService {
  private siteFeePercentage: number = environment.siteFeePercentage;

  constructor() {}

  calculateTotalPrice(basePrice: number, quantity: number = 1) {
    const ownerAmount = basePrice * quantity;
    const siteFee = (this.siteFeePercentage / 100) * ownerAmount;
    const totalAmount = Math.round((ownerAmount + siteFee) * 100) / 100; // Round to 2 decimals

    return {
      ownerAmount,
      siteFee,
      totalAmount,
    };
  }
}
