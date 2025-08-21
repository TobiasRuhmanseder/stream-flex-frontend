import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideRowComponent } from './slide-row.component';

describe('SlideRowComponent', () => {
  let component: SlideRowComponent;
  let fixture: ComponentFixture<SlideRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
