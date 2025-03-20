import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-rental',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rentals-base.component.html',
  styleUrls: ['./rentals-base.component.scss'],
})
export class RentalsComponent {
  rentals$: Observable<any[]> = of([]);

  constructor(private apiService: ApiService) {
    this.fetchRentals();
  }

  fetchRentals(): void {
    this.rentals$ = this.apiService.get<any[]>('listings');
  }

  // Create a new rental
  addRental(newRental: any): void {
    this.apiService.post<any>('listings', newRental).subscribe({
      next: (response) => {
        console.log('Rental added:', response);
        this.fetchRentals(); // Refresh the list after adding
      },
      error: (err) => console.error('Error adding rental:', err),
    });
  }

  // Update an existing rental
  updateRental(id: string, updatedData: any): void {
    this.apiService.patch<any>(`listings/${id}`, updatedData).subscribe({
      next: (response) => {
        console.log('Rental updated:', response);
        this.fetchRentals(); // Refresh the list after updating
      },
      error: (err) => console.error('Error updating rental:', err),
    });
  }

  // Delete a rental
  deleteRental(id: string): void {
    this.apiService.delete<any>(`listings/${id}`).subscribe({
      next: () => {
        console.log(`Rental ${id} deleted`);
        this.fetchRentals(); // Refresh the list after deleting
      },
      error: (err) => console.error('Error deleting rental:', err),
    });
  }
}
