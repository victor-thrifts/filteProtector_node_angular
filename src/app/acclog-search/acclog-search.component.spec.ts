import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcclogSearchComponent } from './acclog-search.component';

describe('AcclogSearchComponent', () => {
  let component: AcclogSearchComponent;
  let fixture: ComponentFixture<AcclogSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcclogSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcclogSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
