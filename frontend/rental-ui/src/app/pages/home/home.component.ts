import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  @ViewChild('choose') chooseDiv!: ElementRef;
  currentDate!: string;

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
  }
}
