import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersWorkingComponent } from './offers-working.component';

describe('OffersWorkingComponent', () => {
  let component: OffersWorkingComponent;
  let fixture: ComponentFixture<OffersWorkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffersWorkingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffersWorkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
