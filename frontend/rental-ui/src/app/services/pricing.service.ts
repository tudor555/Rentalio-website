import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
  })
  export class PricingService {
    private siteFeePercentage: number = environment.siteFeePercentage;
  
    constructor() {}
  
    calculateTotalPrice(basePrice: number): number {
      const siteFee = (this.siteFeePercentage / 100) * basePrice;
      return Math.round((basePrice + siteFee) * 100) / 100; // Round to 2 decimals
    }
  }