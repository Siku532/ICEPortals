import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {
  constructor() { }

  lastVisit = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  YesNo = [{ key: 'n', value: 'No' }, { key: 'y', value: 'YES' }];
  YesNoAll = [{ key: '', value: 'ALL SKU' }, { key: 'Y', value: 'MSL' } ];
  impactType = [{ key: '1', value: 'Manual Impact' }, { key: '2', value: 'Absentee Impact' }];

  getLastVisit() {
    return this.lastVisit;
  }
  getYesNo() {
    return this.YesNo;
  }
  getYesNoAll() {
    return this.YesNoAll;
  }

  getImpactType() {
    return this.impactType;
  }
}
