import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { UserSessionService } from '../../../services/user-session.service';

@Component({
  selector: 'app-rental-edit-property',
  imports: [CommonModule, FormsModule],
  templateUrl: './rental-edit-property.component.html',
  styleUrl: './rental-edit-property.component.scss',
})
export class RentalEditPropertyComponent {
  // UI State
  today: string = new Date().toISOString().split('T')[0];
  acceptedFormats = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
  previewImages: string[] = [];
  successMessage = '';
  errorMessage = '';
  amenitiesString = '';

  // route id
  private listingId: string | null = null;

  private originalProperty: any | null = null;

  // Form Model
  property = {
    title: '',
    description: '',
    category: '',
    basePrice: null as number | null,
    priceType: '',
    images: [] as string[],
    location: {
      country: '',
      city: '',
      address: '',
      coordinates: { lat: null as number | null, lng: null as number | null },
    },
    amenities: [] as string[],
    availability: {
      from: '',
      to: '',
      minStay: null as number | null,
      maxStay: null as number | null,
    },
    tags: [] as string[],
  };

  // Select Options
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

  // Lifecycle
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!UserSessionService.isLoggedIn()) {
      this.router.navigateByUrl('/auth/login');
      return;
    }
    if (!UserSessionService.isOwnerOrAdmin()) {
      this.router.navigateByUrl('/become-owner');
      return;
    }

    this.listingId = this.route.snapshot.paramMap.get('id');
    if (this.listingId) this.fetchRentalDetails(this.listingId);
  }

  // Data Load
  fetchRentalDetails(id: string): void {
    this.apiService.get<any>(`listings/${id}`).subscribe({
      next: (l) => {
        this.property = {
          title: l?.title ?? '',
          description: l?.description ?? '',
          category: l?.category ?? '',
          basePrice: l?.pricing?.basePrice ?? l?.basePrice ?? null,
          priceType: l?.pricing?.pricingUnit ?? l?.priceType ?? '',
          images: (l?.images || [])
            .map((img: any) => (typeof img === 'string' ? img : img?.url))
            .filter(Boolean),
          location: {
            country: l?.address?.country ?? l?.location?.country ?? '',
            city: l?.address?.city ?? l?.location?.city ?? '',
            address: l?.address?.street ?? l?.location?.address ?? '',
            coordinates: {
              lat: l?.address?.lat ?? l?.location?.coordinates?.lat ?? null,
              lng: l?.address?.lng ?? l?.location?.coordinates?.lng ?? null,
            },
          },
          amenities: Array.isArray(l?.amenities) ? l.amenities : [],
          availability: {
            from: (l?.availability?.from ?? '').slice(0, 10),
            to: (l?.availability?.to ?? '').slice(0, 10),
            minStay: l?.availability?.minStay ?? null,
            maxStay: l?.availability?.maxStay ?? null,
          },
          tags: Array.isArray(l?.tags) ? l.tags : [],
        };

        this.amenitiesString = this.property.amenities.join(', ');
        this.previewImages = [...this.property.images];

        // After fetchRentalDetails success
        this.originalProperty = JSON.parse(JSON.stringify(this.property));
      },
      error: (err) => {
        console.error('Error fetching rental details:', err);
        this.errorMessage = 'Failed to load listing details.';
      },
    });
  }

  // Form Helpers
  preventTyping(event: KeyboardEvent): void {
    event.preventDefault();
  }

  // Available To must be >= today if provided
  availableToInvalid(): boolean {
    const to = this.property.availability.to;
    if (!to) return false;
    return to < this.today;
  }

  triggerFileInput(): void {
    if (this.previewImages.length >= 16) return;
    const fileInput = document.getElementById(
      'fileInput'
    ) as HTMLInputElement | null;
    if (fileInput) fileInput.click();
  }

  // Handle file selection and create previews (max 16, 5MB, mime check)
  onImageUpload(event: Event): void {
    const files = (event.target as HTMLInputElement).files as FileList | null;
    if (!files || files.length === 0) return;

    const newPreviews: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // MIME type check
      if (!this.acceptedFormats.includes(file.type)) continue;

      // 5MB cap
      if (file.size > 5 * 1024 * 1024) continue;

      // Total cap 16
      if (this.previewImages.length + newPreviews.length >= 16) break;

      // Create object URL for preview
      newPreviews.push(URL.createObjectURL(file));
    }

    this.previewImages.push(...newPreviews);

    // Allow re-selecting the same files later
    (event.target as HTMLInputElement).value = '';
  }

  // Remove preview (revoke the object URL to free memory)
  removeImage(index: number): void {
    const url = this.previewImages[index];
    if (url?.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(url);
      } catch {}
    }
    this.previewImages.splice(index, 1);
  }

  // Submit
  saveChanges(form: NgForm): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Basic validation: template-driven required fields + "Available To" rule
    if (form.invalid || this.availableToInvalid()) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      return;
    }

    if (!this.listingId || !this.originalProperty) {
      this.errorMessage = 'Missing rental data.';
      return;
    }

    // Normalize amenities from comma-separated string
    const cleanedAmenities: string[] = this.amenitiesString
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '');

    // Current state used for comparison
    const currentState = {
      ...this.property,
      amenities: cleanedAmenities,
    };

    // Build minimal payload: only include fields that changed
    const payload: any = {};

    // Primitive/top-level fields
    if (currentState.title !== this.originalProperty.title) {
      payload.title = currentState.title;
    }
    if (currentState.description !== this.originalProperty.description) {
      payload.description = currentState.description;
    }
    if (currentState.category !== this.originalProperty.category) {
      payload.category = currentState.category;
    }
    if (currentState.basePrice !== this.originalProperty.basePrice) {
      payload.basePrice = currentState.basePrice;
    }
    if (currentState.priceType !== this.originalProperty.priceType) {
      payload.priceType = currentState.priceType;
    }

    // Location: if any nested field changed, send the FULL location object
    const location = currentState.location;
    const originalLocation = this.originalProperty.location;

    const locationChanged =
      location.country !== originalLocation.country ||
      location.city !== originalLocation.city ||
      location.address !== originalLocation.address ||
      location.coordinates.lat !== originalLocation.coordinates.lat ||
      location.coordinates.lng !== originalLocation.coordinates.lng;

    if (locationChanged) {
      payload.location = {
        country: location.country,
        city: location.city,
        address: location.address,
        coordinates: {
          lat: location.coordinates.lat,
          lng: location.coordinates.lng,
        },
      };
    }

    // Amenities: compare arrays; if changed, send full array
    const amenitiesChanged =
      JSON.stringify(currentState.amenities) !==
      JSON.stringify(this.originalProperty.amenities);

    if (amenitiesChanged) {
      payload.amenities = currentState.amenities;
    }

    // Availability: if any nested field changed, send the FULL availability object
    const availability = currentState.availability;
    const originalAvailability = this.originalProperty.availability;

    const availabilityChanged =
      availability.from !== originalAvailability.from ||
      availability.to !== originalAvailability.to ||
      availability.minStay !== originalAvailability.minStay ||
      availability.maxStay !== originalAvailability.maxStay;

    if (availabilityChanged) {
      payload.availability = {
        from: availability.from,
        to: availability.to,
        minStay: availability.minStay,
        maxStay: availability.maxStay,
      };
    }

    // Tags: compare arrays; if changed, send full array
    const tagsChanged =
      JSON.stringify(currentState.tags) !==
      JSON.stringify(this.originalProperty.tags);

    if (tagsChanged) {
      payload.tags = currentState.tags;
    }

    // Nothing changed
    if (Object.keys(payload).length === 0) {
      this.successMessage = 'Nothing to save — no changes detected.';
      return;
    }

    // PATCH only changed fields (images intentionally excluded for now)
    this.apiService
      .patch<any>(`listings/${this.listingId}`, payload, true)
      .subscribe({
        next: () => {
          this.successMessage = 'Changes saved!';
          this.errorMessage = '';
          // Refresh local snapshot to the new "saved" state
          this.originalProperty = JSON.parse(JSON.stringify(currentState));
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Failed to save changes.';
          console.error('Error updating listing:', err);
        },
      });
  }

  cancel() {
    this.router.navigateByUrl('/rentals');
  }

  goToListing(): void {
    if (!this.listingId) return;
    this.router.navigate(['/rental', this.listingId]);
  }
}
