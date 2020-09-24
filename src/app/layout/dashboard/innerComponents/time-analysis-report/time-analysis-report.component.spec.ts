import { async, ComponentFixture, TestBed } from 'src/app/layout/dashboard/innerComponents/time-analysis-report/node_modules/@angular/core/testing';

import { TimeAnalysisReportComponent } from './time-analysis-report.component';

describe('TimeAnalysisReportComponent', () => {
  let component: TimeAnalysisReportComponent;
  let fixture: ComponentFixture<TimeAnalysisReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeAnalysisReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeAnalysisReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
