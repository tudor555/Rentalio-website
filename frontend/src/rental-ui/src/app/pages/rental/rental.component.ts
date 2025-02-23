import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-rental',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.scss'],
})
export class RentalComponent {
  rentals$: Observable<any[]>;

  constructor(private apiService: ApiService) {
    this.rentals$ = this.apiService.get<any[]>('listings');
  }
}
