import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuDashboardComponent } from './sku-dashboard.component';

describe('SkuDashboardComponent', () => {
  let component: SkuDashboardComponent;
  let fixture: ComponentFixture<SkuDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkuDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkuDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
