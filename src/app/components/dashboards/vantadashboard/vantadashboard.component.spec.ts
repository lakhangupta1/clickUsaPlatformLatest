import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VantadashboardComponent } from './vantadashboard.component';

describe('VantadashboardComponent', () => {
  let component: VantadashboardComponent;
  let fixture: ComponentFixture<VantadashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VantadashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VantadashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
