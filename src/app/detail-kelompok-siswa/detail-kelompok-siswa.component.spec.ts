import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailKelompokSiswaComponent } from './detail-kelompok-siswa.component';

describe('DetailKelompokSiswaComponent', () => {
  let component: DetailKelompokSiswaComponent;
  let fixture: ComponentFixture<DetailKelompokSiswaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailKelompokSiswaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailKelompokSiswaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
