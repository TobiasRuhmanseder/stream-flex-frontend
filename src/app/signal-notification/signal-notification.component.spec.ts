import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalNotificationComponent } from './signal-notification.component';

describe('SignalNotificationComponent', () => {
  let component: SignalNotificationComponent;
  let fixture: ComponentFixture<SignalNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignalNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
