import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuUtamaKerumatanggaanComponent } from './menu-utama-kerumatanggaan.component';

describe('MenuUtamaKerumatanggaanComponent', () => {
  let component: MenuUtamaKerumatanggaanComponent;
  let fixture: ComponentFixture<MenuUtamaKerumatanggaanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuUtamaKerumatanggaanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuUtamaKerumatanggaanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
