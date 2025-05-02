import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { UserSessionService } from '../../../services/user-session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rental-list-property',
  imports: [CommonModule, FormsModule],
  templateUrl: './rental-list-property.component.html',
  styleUrl: './rental-list-property.component.scss',
})
export class RentalListPropertyComponent {
  propertyForm!: NgForm;
  acceptedFormats = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
  previewImages: string[] = [];
  today: string = new Date().toISOString().split('T')[0];
  amenitiesString: string = '';

  // Property data model
  property = {
    title: '',
    description: '',
    category: '',
    basePrice: null,
    priceType: '',
    images: [],
    location: {
      country: '',
      city: '',
      address: '',
      coordinates: {
        lat: null,
        lng: null,
      },
    },
    amenities: [] as string[],
    availability: {
      from: this.today,
      to: '',
      minStay: null,
      maxStay: null,
    },
    tags: [],
  };

  propertyTypes = [
    { value: '', label: 'Select a category' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'playground', label: 'Playground' },
    { value: 'football_field', label: 'Football Field' },
    { value: 'tennis_field', label: 'Tennis Field' },
    { value: 'office', label: 'Office' },
    { value: 'other', label: 'Other' },
  ];

  priceTypes = [
    { value: '', label: 'Select price type' },
    { value: 'hour', label: 'Per Hour' },
    { value: 'day', label: 'Per Day' },
    { value: 'week', label: 'Per Week' },
    { value: 'month', label: 'Per Month' },
    { value: 'year', label: 'Per Year' },
  ];

  successMessage: string = '';
  errorMessage: string = '';
  showSuccessModal: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    if (!UserSessionService.isLoggedIn()) {
      this.router.navigateByUrl('/auth/login');
      return;
    }

    if (!UserSessionService.isOwnerOrAdmin()) {
      this.router.navigateByUrl('/become-owner');
      return;
    }
  }

  isAvailableFromValidation(): boolean {
    if (!this.property.availability.from) return false;
    const selectedDate = new Date(this.property.availability.from);
    const todayDate = new Date(this.today);
    return selectedDate < todayDate;
  }

  triggerFileInput() {
    if (this.previewImages.length >= 16) {
      return;
    }
    const fileInput = document.getElementById('fileInput') as HTMLElement;
    fileInput.click();
  }

  onImageUpload(event: any) {
    const files: FileList = event.target.files;

    if (files && files.length > 0) {
      const newPreviews: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Check file type
        if (!this.acceptedFormats.includes(file.type)) {
          continue;
        }

        // Check file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          continue;
        }

        if (this.previewImages.length + newPreviews.length >= 16) {
          break;
        }

        newPreviews.push(URL.createObjectURL(file));
      }

      this.previewImages.push(...newPreviews);
    }
  }

  removeImage(index: number) {
    this.previewImages.splice(index, 1);
  }

  listingSubmit(form: NgForm) {
    this.propertyForm = form;

    if (form.invalid) {
      this.errorMessage =
        'Please fill out all required fields before submitting.';
      return;
    }

    // Convert amenities string to array
    const cleanedAmenities = this.amenitiesString
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item !== '');

    const propertyData = {
      ...this.property,
      amenities: cleanedAmenities,
      ownerId: UserSessionService.loadUser()._id,
    };

    this.apiService.post<any>(`listings/add`, propertyData, true).subscribe({
      next: (data) => {
        this.successMessage = 'Property listed successfully!';
        this.showSuccessModal = true;
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message ||
          'An error occurred while listing the property.';
        console.error('Error post listing:', err);
      },
    });
  }

  // Method to reset form after successful submission
  resetForm(form: NgForm) {
    form.resetForm();

    this.property = {
      title: '',
      description: '',
      category: '',
      basePrice: null,
      priceType: '',
      images: [],
      location: {
        country: '',
        city: '',
        address: '',
        coordinates: {
          lat: null,
          lng: null,
        },
      },
      amenities: [],
      availability: {
        from: this.today,
        to: '',
        minStay: null,
        maxStay: null,
      },
      tags: [],
    };
    this.previewImages = [];
    this.amenitiesString = '';
    this.successMessage = '';
    this.errorMessage = '';
  }

  listAnother() {
    this.showSuccessModal = false;
    this.resetForm(this.propertyForm);
    window.location.reload(); // Reloads the entire app
  }

  goToRentals() {
    this.router.navigateByUrl('/rentals');
  }
}
