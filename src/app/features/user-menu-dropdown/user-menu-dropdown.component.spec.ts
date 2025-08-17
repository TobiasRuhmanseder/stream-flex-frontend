import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMenuDropdownComponent } from './user-menu-dropdown.component';

describe('UserMenuDropdownComponent', () => {
  let component: UserMenuDropdownComponent;
  let fixture: ComponentFixture<UserMenuDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMenuDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMenuDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
