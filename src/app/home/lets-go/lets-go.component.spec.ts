import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetsGoComponent } from './lets-go.component';

describe('LetsGoComponent', () => {
  let component: LetsGoComponent;
  let fixture: ComponentFixture<LetsGoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LetsGoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LetsGoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
