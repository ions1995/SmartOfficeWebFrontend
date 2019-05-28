import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMeetingPage } from './create-meeting.page';

describe('CreateMeetingPage', () => {
  let component: CreateMeetingPage;
  let fixture: ComponentFixture<CreateMeetingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMeetingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMeetingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
