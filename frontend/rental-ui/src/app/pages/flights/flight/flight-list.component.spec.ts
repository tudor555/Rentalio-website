import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightListComponent } from './flight-list.component';

describe('FlightComponent', () => {
  let component: FlightListComponent;
  let fixture: ComponentFixture<FlightListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
