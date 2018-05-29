import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KelolaSiswaComponent } from './kelola-siswa.component';

describe('KelolaSiswaComponent', () => {
  let component: KelolaSiswaComponent;
  let fixture: ComponentFixture<KelolaSiswaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KelolaSiswaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KelolaSiswaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
