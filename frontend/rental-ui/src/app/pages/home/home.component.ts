import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  @ViewChild('choose') chooseDiv!: ElementRef;
  currentDate!: string;
  listings: any[] = [];

  departure: string = '';
  destination: string = '';
  departureDate: string = '';
  departureDateInvalid: boolean = false;

  imageUrls = [
    'assets/images/destinations/adorjan-1&2.jpeg',
    'assets/images/destinations/cherry-blossoms-center.jpeg',
    'assets/images/destinations/defileu-summer.jpeg',
    'assets/images/destinations/flowers-spring.jpeg',
    'assets/images/destinations/rev-tunnel.jpeg',
    'assets/images/destinations/uo-magnolia.jpeg',
    'assets/images/destinations/winter-forest.jpeg',
    'assets/images/destinations/winter-forest-river.jpeg',
  ];

  constructor(private apiService: ApiService) {}

  // Function to handle the scroll action
  scrollToChoose() {
    this.chooseDiv.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  ngOnInit() {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    this.currentDate = `${year}-${month}-${day}`; // Format: YYYY-MM-DD
    this.departureDate = this.currentDate;

    this.apiService
      .get<any>(`listings/search?sort=createdAt_desc&limit=4`)
      .subscribe({
        next: (data) => {
          this.listings = data;
        },
        error: (err) => {
          console.error('Error fetching last 4 listings:', err);
        },
      });

    // Shuffle the image array
    this.imageUrls = this.shuffleArray(this.imageUrls);
  }

  validateDate() {
    const today = new Date().toISOString().split('T')[0];
    if (this.departureDate && this.departureDate < today) {
      this.departureDateInvalid = true;
    } else {
      this.departureDateInvalid = false;
    }
  }

  onBuyTickets() {
    console.log('Flight info:', {
      from: this.departure,
      to: this.destination,
      date: this.departureDate,
    });

    // TODO: Now perform your actual flight search or API request here. After redirect to 'flights/list'
  }

  // Shuffle image array
  shuffleArray(randomArray: string[]): string[] {
    return randomArray
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }
}
