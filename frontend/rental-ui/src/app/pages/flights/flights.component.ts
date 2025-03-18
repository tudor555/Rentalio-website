import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-flights',
  imports: [RouterOutlet],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.scss',
})
export class FlightsComponent {
  constructor(private router: Router) {}

  navigateToFlight() {
    this.router.navigate(['/flights/flight']);
  }
}
