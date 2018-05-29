import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KelolaTanamanComponent } from './kelola-tanaman.component';

describe('KelolaTanamanComponent', () => {
  let component: KelolaTanamanComponent;
  let fixture: ComponentFixture<KelolaTanamanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KelolaTanamanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KelolaTanamanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
