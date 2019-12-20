import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogAllsComponent } from './logAlls.component';

describe('LogAllsComponent', () => {
  let component: LogAllsComponent;
  let fixture: ComponentFixture<LogAllsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogAllsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogAllsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
