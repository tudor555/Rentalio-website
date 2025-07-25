import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalComponent } from './rentals-base.component';

describe('RentalComponent', () => {
  let component: RentalComponent;
  let fixture: ComponentFixture<RentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
