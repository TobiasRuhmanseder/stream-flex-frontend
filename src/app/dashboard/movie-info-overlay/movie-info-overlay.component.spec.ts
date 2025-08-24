import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieInfoOverlayComponent } from './movie-info-overlay.component';

describe('MovieInfoOverlayComponent', () => {
  let component: MovieInfoOverlayComponent;
  let fixture: ComponentFixture<MovieInfoOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieInfoOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieInfoOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
