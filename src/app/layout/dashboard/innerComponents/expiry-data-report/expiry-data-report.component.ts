import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-expiry-data-report',
  templateUrl: './expiry-data-report.component.html',
  styleUrls: ['./expiry-data-report.component.scss']
})
export class ExpiryDataReportComponent implements OnInit {
title='';
  constructor(public router: Router) { }

  ngOnInit() {
    if(this.router.url=="/dashboard/expiry-data-mt"){
      this.title = 'Expiry Data-MT';
    }
    else{
      this.title = 'Expiry Data-GT';
    }
  }

}
