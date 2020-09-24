import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shops-for-single-route',
  templateUrl: './shops-for-single-route.component.html',
  styleUrls: ['./shops-for-single-route.component.scss']
})
export class ShopsForSingleRouteComponent implements OnInit {

  title = 'single route shop list';
  loadingData: boolean;
  constructor() { }

  ngOnInit() {
    this.loadingData = false;
  }

}
