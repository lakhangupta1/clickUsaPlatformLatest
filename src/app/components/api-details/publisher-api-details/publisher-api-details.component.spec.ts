import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublisherApiDetailsComponent } from './publisher-api-details.component';

describe('PublisherApiDetailsComponent', () => {
  let component: PublisherApiDetailsComponent;
  let fixture: ComponentFixture<PublisherApiDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublisherApiDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublisherApiDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
