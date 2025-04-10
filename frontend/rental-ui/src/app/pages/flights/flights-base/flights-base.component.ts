import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-flights',
  imports: [RouterOutlet, CommonModule, FormsModule],
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

    const payload = {
      from: this.from.trim(),
      destination: this.destination.trim(),
      departureDate: this.departureDate,
      returnDate: this.returnDate || null,
      adults: this.adults,
      children: this.children || 0,
    };

    console.log('Flight search submitted:', payload);
    // Insert your API logic or routing here
  }
}
