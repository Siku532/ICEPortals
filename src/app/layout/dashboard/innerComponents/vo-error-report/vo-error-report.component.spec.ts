import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoErrorReportComponent } from './vo-error-report.component';

describe('VoErrorReportComponent', () => {
  let component: VoErrorReportComponent;
  let fixture: ComponentFixture<VoErrorReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoErrorReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoErrorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
