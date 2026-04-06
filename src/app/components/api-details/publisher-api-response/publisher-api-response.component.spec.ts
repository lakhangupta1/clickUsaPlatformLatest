import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublisherApiResponseComponent } from './publisher-api-response.component';

describe('PublisherApiResponseComponent', () => {
  let component: PublisherApiResponseComponent;
  let fixture: ComponentFixture<PublisherApiResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublisherApiResponseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublisherApiResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
