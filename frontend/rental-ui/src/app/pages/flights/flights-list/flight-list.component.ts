import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { flightData } from '../flight-list-data';

@Component({
  selector: 'app-flight',
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './flight-list.component.html',
  styleUrl: './flight-list.component.scss',
})
export class FlightsListComponent {
  flights: any;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    const query = this.route.snapshot.queryParams;
    const from = query['from'];
    const destination = query['destination'];
    const departureDate = query['departureDate'];

    if (!from || !destination || !departureDate) {
      this.error = 'Invalid departure or destination name.';
      this.loading = false;
      return;
    }
    const apiQuery = {
      from: from,
      destination: destination,
      departureDate: departureDate,
      flightType: query['flightType'],
      returnDate: query['returnDate'] || null,
      adults: query['adults'] || 1,
      childrens: query['children'] || 0,
    };

    this.api.post('flights', apiQuery).subscribe({
      next: (res: any) => {
        this.flights = res.other_flights || [];
        console.log(this.flights);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching flights:', err);
        this.error = 'Failed to fetch flights.';
        this.loading = false;

        setTimeout(() => {
          this.router.navigate(['/flights']);
        }, 2000);
      },
    });
  }

  // Can use this if dont want to made an api call
  // ngOnInit() {
  //   this.takeFlightData();
  // }

  //  takeFlightData() {
  //    this.flights = flightData.best_flights;
  //    this.loading = false;
  //  }
}
