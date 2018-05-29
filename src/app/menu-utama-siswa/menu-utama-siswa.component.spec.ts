import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuUtamaSiswaComponent } from './menu-utama-siswa.component';

describe('MenuUtamaSiswaComponent', () => {
  let component: MenuUtamaSiswaComponent;
  let fixture: ComponentFixture<MenuUtamaSiswaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuUtamaSiswaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuUtamaSiswaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
