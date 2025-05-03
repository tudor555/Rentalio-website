import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flights',
  imports: [CommonModule, FormsModule],
  templateUrl: './flights-base.component.html',
  styleUrl: './flights-base.component.scss',
})
export class FlightsComponent {
  from = '';
  destination = '';
  today = new Date().toISOString().split('T')[0]; // Used for both min values
  departureDate = this.today;
  returnDate = '';
  departureDateInvalid = false;
  returnDateInvalid = false;
  adults = 1;
  children = 0;

  constructor(private router: Router) {}

  submitFlightSearch(form: NgForm) {
    const todayDate = new Date(this.today);
    const expectedDepartureDate = new Date(this.departureDate);
    const expectedReturnDate = this.returnDate
      ? new Date(this.returnDate)
      : null;

    this.departureDateInvalid = expectedDepartureDate < todayDate;
    this.returnDateInvalid =
      !!expectedReturnDate && expectedReturnDate < expectedDepartureDate;

    if (form.invalid || this.departureDateInvalid || this.returnDateInvalid) {
      form.control.markAllAsTouched();
      return;
    }

    let payload: any = {
      from: this.from.trim(),
      destination: this.destination.trim(),
      departureDate: this.departureDate,
      flightType: this.returnDate ? 1 : 2,
      adults: this.adults || 1,
    };
    if (this.returnDate) {
      payload.returnDate = this.returnDate;
    }

    if (this.children) {
      payload.children = this.children;
    }

    this.router.navigate(['/flights/list'], {
      queryParams: payload,
    });
  }
}
