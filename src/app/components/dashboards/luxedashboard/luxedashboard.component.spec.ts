import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuxedashboardComponent } from './luxedashboard.component';

describe('LuxedashboardComponent', () => {
  let component: LuxedashboardComponent;
  let fixture: ComponentFixture<LuxedashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxedashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LuxedashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
