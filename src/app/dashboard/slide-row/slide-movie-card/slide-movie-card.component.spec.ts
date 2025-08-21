import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideMovieCardComponent } from './slide-movie-card.component';

describe('SlideMovieCardComponent', () => {
  let component: SlideMovieCardComponent;
  let fixture: ComponentFixture<SlideMovieCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideMovieCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideMovieCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
