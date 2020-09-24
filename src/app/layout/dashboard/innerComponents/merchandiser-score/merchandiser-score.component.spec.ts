import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiserScoreComponent } from './merchandiser-score.component';

describe('MerchandiserScoreComponent', () => {
  let component: MerchandiserScoreComponent;
  let fixture: ComponentFixture<MerchandiserScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchandiserScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiserScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
