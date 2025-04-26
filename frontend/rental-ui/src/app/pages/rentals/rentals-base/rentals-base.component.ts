import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Observable, of } from 'rxjs';
import { UserSessionService } from '../../../services/user-session.service';
import { FormsModule } from '@angular/forms';

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

  constructor(private apiService: ApiService) {
    this.fetchRentals();
  }

  fetchRentals(): void {
    this.rentals = this.apiService.get<any>('listings');
  }

  searchByTitle() {
    const trimmedTitle = this.searchTitle.trim();
  
    if (!trimmedTitle) {
      // If empty, fetch all listings
      this.fetchRentals();
      return;
    }

    this.apiService.get<any>(`listings/search?title=${trimmedTitle}`).subscribe({
      next: (data) => {
        this.rentals= of(data);
      },
      error: (err) => {
        console.error('Error fetching rental details:', err);
      },
    });
  }
}
