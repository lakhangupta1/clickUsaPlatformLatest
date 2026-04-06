import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostbackListComponent } from './postback-list.component';

describe('PostbackListComponent', () => {
  let component: PostbackListComponent;
  let fixture: ComponentFixture<PostbackListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostbackListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostbackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
