import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuUtamaPdeComponent } from './menu-utama-pde.component';

describe('MenuUtamaPdeComponent', () => {
  let component: MenuUtamaPdeComponent;
  let fixture: ComponentFixture<MenuUtamaPdeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuUtamaPdeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuUtamaPdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
