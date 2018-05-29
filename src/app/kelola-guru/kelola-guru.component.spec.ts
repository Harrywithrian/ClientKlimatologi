import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KelolaGuruComponent } from './kelola-guru.component';

describe('KelolaGuruComponent', () => {
  let component: KelolaGuruComponent;
  let fixture: ComponentFixture<KelolaGuruComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KelolaGuruComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KelolaGuruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
