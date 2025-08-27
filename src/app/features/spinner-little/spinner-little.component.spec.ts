import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerLittleComponent } from './spinner-little.component';

describe('SpinnerLittleComponent', () => {
  let component: SpinnerLittleComponent;
  let fixture: ComponentFixture<SpinnerLittleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerLittleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpinnerLittleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
