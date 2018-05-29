import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailKelompokGuruComponent } from './detail-kelompok-guru.component';

describe('DetailKelompokGuruComponent', () => {
  let component: DetailKelompokGuruComponent;
  let fixture: ComponentFixture<DetailKelompokGuruComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailKelompokGuruComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailKelompokGuruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
