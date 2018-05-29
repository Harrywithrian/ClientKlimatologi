import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KelompokGuruComponent } from './kelompok-guru.component';

describe('KelompokGuruComponent', () => {
  let component: KelompokGuruComponent;
  let fixture: ComponentFixture<KelompokGuruComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KelompokGuruComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KelompokGuruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
