import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuUtamaGuruComponent } from './menu-utama-guru.component';

describe('MenuUtamaGuruComponent', () => {
  let component: MenuUtamaGuruComponent;
  let fixture: ComponentFixture<MenuUtamaGuruComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuUtamaGuruComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuUtamaGuruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
