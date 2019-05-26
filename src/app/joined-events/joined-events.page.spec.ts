import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinedEventsPage } from './joined-events.page';

describe('JoinedEventsPage', () => {
  let component: JoinedEventsPage;
  let fixture: ComponentFixture<JoinedEventsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinedEventsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinedEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
