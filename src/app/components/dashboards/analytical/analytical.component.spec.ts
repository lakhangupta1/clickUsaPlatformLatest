import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticalComponent } from './analytical.component';

describe('AnalyticalComponent', () => {
  let component: AnalyticalComponent;
  let fixture: ComponentFixture<AnalyticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
