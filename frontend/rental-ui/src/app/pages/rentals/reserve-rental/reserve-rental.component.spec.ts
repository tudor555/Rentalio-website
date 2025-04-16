import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveRentalComponent } from './reserve-rental.component';

describe('ReserveRentalComponent', () => {
  let component: ReserveRentalComponent;
  let fixture: ComponentFixture<ReserveRentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReserveRentalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReserveRentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
