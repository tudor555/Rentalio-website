import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-rental-edit-property',
  imports: [],
  templateUrl: './rental-edit-property.component.html',
  styleUrl: './rental-edit-property.component.scss',
})
export class RentalEditPropertyComponent {
  listing: any = null;

  constructor(private apiService: ApiService, private route: ActivatedRoute) {
    const listingId = this.route.snapshot.paramMap.get('id');

    if (listingId) {
      this.fetchRentalDetails(listingId);
    }
  }

  fetchRentalDetails(id: string): void {
    this.apiService.get<any>(`listings/${id}`).subscribe({
      next: (data) => {
        this.listing = data;
      },
      error: (err) => {
        console.error('Error fetching rental details:', err);
      },
    });
  }
}
