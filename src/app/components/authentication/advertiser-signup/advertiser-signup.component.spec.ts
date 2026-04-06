import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertiserSignupComponent } from './advertiser-signup.component';

describe('AdvertiserSignupComponent', () => {
  let component: AdvertiserSignupComponent;
  let fixture: ComponentFixture<AdvertiserSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvertiserSignupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertiserSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
