import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-single-route-detail',
  templateUrl: './single-route-detail.component.html',
  styleUrls: ['./single-route-detail.component.scss']
})
export class SingleRouteDetailComponent implements OnInit {

  title = 'single route detail';
  loadingData: boolean;
  constructor() { }

  ngOnInit() {
    this.loadingData = false;
  }

}
