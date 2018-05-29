import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KelompokSiswaComponent } from './kelompok-siswa.component';

describe('KelompokSiswaComponent', () => {
  let component: KelompokSiswaComponent;
  let fixture: ComponentFixture<KelompokSiswaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KelompokSiswaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KelompokSiswaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
