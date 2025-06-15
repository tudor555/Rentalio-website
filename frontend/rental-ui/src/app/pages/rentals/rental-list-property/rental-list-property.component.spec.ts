import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalListPropertyComponent } from './rental-list-property.component';

describe('RentalListPropertyComponent', () => {
  let component: RentalListPropertyComponent;
  let fixture: ComponentFixture<RentalListPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalListPropertyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalListPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
