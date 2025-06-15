import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightsListComponent } from './flight-list.component';

describe('FlightComponent', () => {
  let component: FlightsListComponent;
  let fixture: ComponentFixture<FlightsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
