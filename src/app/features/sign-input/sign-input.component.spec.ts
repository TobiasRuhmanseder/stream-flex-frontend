import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInputComponent } from './sign-input.component';

describe('SignInputComponent', () => {
  let component: SignInputComponent;
  let fixture: ComponentFixture<SignInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
