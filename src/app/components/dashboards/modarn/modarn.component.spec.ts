import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModarnComponent } from './modarn.component';

describe('ModarnComponent', () => {
  let component: ModarnComponent;
  let fixture: ComponentFixture<ModarnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModarnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModarnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
