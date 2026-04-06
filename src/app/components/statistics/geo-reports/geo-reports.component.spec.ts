import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoReportsComponent } from './geo-reports.component';

describe('GeoReportsComponent', () => {
  let component: GeoReportsComponent;
  let fixture: ComponentFixture<GeoReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeoReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeoReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
