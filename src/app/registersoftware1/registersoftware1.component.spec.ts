import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Registersoftware1Component } from './registersoftware1.component';

describe('Registersoftware1Component', () => {
  let component: Registersoftware1Component;
  let fixture: ComponentFixture<Registersoftware1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Registersoftware1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Registersoftware1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
