import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalEditPropertyComponent } from './rental-edit-property.component';

describe('RentalEditPropertyComponent', () => {
  let component: RentalEditPropertyComponent;
  let fixture: ComponentFixture<RentalEditPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalEditPropertyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalEditPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
