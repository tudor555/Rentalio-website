import { DatePipe, NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-reservations',
  imports: [RouterModule, DatePipe, NgClass, NgFor],
  templateUrl: './admin-reservations.component.html',
  styleUrl: './admin-reservations.component.scss',
})
export class AdminReservationsComponent {
  reservations: any;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchReservations();
  }

  fetchReservations() {
    this.apiService.get<any[]>('reservations').subscribe((reservations) => {
      const fetchRentals = reservations.map(async (res: any) => {
        try {
          const listing = await firstValueFrom(
            this.apiService.get<any>(`listings/${res.listingId}`, true)
          );
          return {
            ...res,
            listingTitle: listing.title,
          };
        } catch {
          return {
            ...res,
            listingTitle: res.listingId,
          };
        }
      });

      Promise.all(fetchRentals).then((results) => {
        this.reservations = results;
      });
    });
  }

  searchReservation() {}

  openCancelModal(test: any) {}
}
