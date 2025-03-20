import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-flights',
  imports: [RouterOutlet],
  templateUrl: './flights-base.component.html',
  styleUrl: './flights-base.component.scss',
})
export class FlightsComponent {
  constructor(private router: Router) {}

  navigateToFlight() {
    this.router.navigate(['/flights/flight']);
  }
}
