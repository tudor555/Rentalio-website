import { Component, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  acceptedFormats = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
  previewImages: string[] = [];
  today: string = new Date().toISOString().split('T')[0];

  // messages
  successMessage: string = '';
  errorMessage: string = '';

  amenitiesString: string = '';

  // current listing id
  private listingId: string | null = null;

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
      from: this.today,
      to: '',
      minStay: null as number | null,
      maxStay: null as number | null,
    },
    tags: [] as string[],
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

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // same access gate as List Property
    if (!UserSessionService.isLoggedIn()) {
      this.router.navigateByUrl('/auth/login');
      return;
    }
    if (!UserSessionService.isOwnerOrAdmin()) {
      this.router.navigateByUrl('/become-owner');
      return;
    }

    this.listingId = this.route.snapshot.paramMap.get('id');
    if (this.listingId) {
      this.fetchRentalDetails(this.listingId);
    }
  }

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
            from: (l?.availability?.from ?? this.today).slice(0, 10),
            to: (l?.availability?.to ?? '').slice(0, 10),
            minStay: l?.availability?.minStay ?? null,
            maxStay: l?.availability?.maxStay ?? null,
          },
          tags: Array.isArray(l?.tags) ? l.tags : [],
        };

        // seed amenities input and image previews
        this.amenitiesString = this.property.amenities.join(', ');
        this.previewImages = [...this.property.images];
      },
      error: (err) => {
        console.error('Error fetching rental details:', err);
        this.errorMessage = 'Failed to load listing details.';
      },
    });
  }

  isAvailableFromValidation(): boolean {
    if (!this.property.availability.from) return false;
    const selectedDate = new Date(this.property.availability.from);
    const todayDate = new Date(this.today);
    return selectedDate < todayDate;
  }

  /** Trigger hidden input (16 images cap) */
  triggerFileInput() {
    if (this.previewImages.length >= 16) return;
    this.fileInputRef?.nativeElement.click();
  }

  /** Local previews; same rules: accepted formats + 5MB + cap 16 */
  onImageUpload(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files || !files.length) return;

    const newPreviews: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)!;

      if (!this.acceptedFormats.includes(file.type)) continue;
      if (file.size > 5 * 1024 * 1024) continue; // 5MB

      if (this.previewImages.length + newPreviews.length >= 16) break;

      // Use object URL like List Property
      newPreviews.push(URL.createObjectURL(file));
    }

    this.previewImages.push(...newPreviews);
    (event.target as HTMLInputElement).value = '';
  }

  removeImage(index: number) {
    this.previewImages.splice(index, 1);
  }

  /** Save button from the form (UI-first). Wire API later if you want. */
  saveChanges(form: NgForm) {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.invalid || this.isAvailableFromValidation()) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      return;
    }

    // Convert amenities string to array (same as Add page)
    const cleanedAmenities = this.amenitiesString
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '');

    // Build an update-friendly payload; for now we just log it.
    const payload = {
      ...this.property,
      amenities: cleanedAmenities,
      images: this.previewImages,
    };

    console.log('EDIT payload (ready for PATCH/PUT):', payload);

    // if (!this.listingId) return;
    // this.apiService.patch<any>(`listings/${this.listingId}`, payload, true).subscribe({
    //   next: () => this.successMessage = 'Changes saved!',
    //   error: (err) => {
    //     this.errorMessage = err?.error?.message || 'Failed to save changes.';
    //     console.error('Error updating listing:', err);
    //   }
    // });

    this.successMessage = 'Changes prepared (API wiring pending).';
  }

  cancel() {
    this.router.navigateByUrl('/rentals');
  }
}
