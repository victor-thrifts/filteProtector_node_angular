import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcclogesComponent } from './accloges.component';

describe('AcclogesComponent', () => {
  let component: AcclogesComponent;
  let fixture: ComponentFixture<AcclogesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcclogesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcclogesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
