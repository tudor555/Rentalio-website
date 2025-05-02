import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeOwnerComponent } from './become-owner.component';

describe('BecomeOwnerComponent', () => {
  let component: BecomeOwnerComponent;
  let fixture: ComponentFixture<BecomeOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecomeOwnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BecomeOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
