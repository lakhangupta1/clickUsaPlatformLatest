import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostbackAddComponent } from './postback-add.component';

describe('PostbackAddComponent', () => {
  let component: PostbackAddComponent;
  let fixture: ComponentFixture<PostbackAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostbackAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostbackAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
