import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiserWiseScoreComponent } from './merchandiser-wise-score.component';

describe('MerchandiserWiseScoreComponent', () => {
  let component: MerchandiserWiseScoreComponent;
  let fixture: ComponentFixture<MerchandiserWiseScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchandiserWiseScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiserWiseScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
