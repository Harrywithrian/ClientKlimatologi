import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IklimComponent } from './iklim.component';

describe('IklimComponent', () => {
  let component: IklimComponent;
  let fixture: ComponentFixture<IklimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IklimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IklimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
