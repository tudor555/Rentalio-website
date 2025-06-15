import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  imports: [FormsModule, NgIf],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent {
  email: string = '';
  title: string = '';
  description: string = '';

  emailPattern: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';

  sendMessage() {
    // Check if form is valid
    if (this.title && this.email && this.description) {
      // TODO: Will send the email using an email service or API in the future
      console.log('Message Sent:', {
        title: this.title,
        email: this.email,
        description: this.description,
      });
    } else {
      console.log('Please fill all fields!');
    }
  }
}
