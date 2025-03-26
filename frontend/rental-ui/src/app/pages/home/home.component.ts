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

  // Function to handle the scroll action
  scrollToChoose() {
    this.chooseDiv.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
