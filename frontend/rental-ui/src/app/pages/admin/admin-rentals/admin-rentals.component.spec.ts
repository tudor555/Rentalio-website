import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRentalsComponent } from './admin-rentals.component';

describe('AdminRentalsComponent', () => {
  let component: AdminRentalsComponent;
  let fixture: ComponentFixture<AdminRentalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRentalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRentalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
