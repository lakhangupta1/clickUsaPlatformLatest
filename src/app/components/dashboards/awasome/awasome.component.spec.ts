import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwasomeComponent } from './awasome.component';

describe('AwasomeComponent', () => {
  let component: AwasomeComponent;
  let fixture: ComponentFixture<AwasomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AwasomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwasomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
