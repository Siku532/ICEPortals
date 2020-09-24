import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionTenViewComponent } from './section-ten-view.component';

describe('SectionTenViewComponent', () => {
  let component: SectionTenViewComponent;
  let fixture: ComponentFixture<SectionTenViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionTenViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionTenViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
