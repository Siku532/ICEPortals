import { Component, OnInit, AfterViewChecked, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { DashboardService } from './dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from "moment";
import { ModalDirective } from 'ngx-bootstrap';
import { config } from 'src/assets/config';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  main_logo=config.main_logo;

  @ViewChild('childModal') childModal: ModalDirective;

  constructor(private httpService: DashboardService, private toastr: ToastrService, private router: Router) {
    // console.log(router.url);
  }

  ngOnInit() {
    var t = moment(new Date).format('YYYY-MM-DD');
    var st = localStorage.getItem('today');
    if (t > st) this.router.navigate(['/login']);
    this.getZone();
    this.httpService.data.subscribe(data => {

      // console.log("download status subscribe",data)
      if(data)
      this.showChildModal();
      else
      this.hideChildModal();
      //do what ever needs doing when data changes
    })
    
  }

  getZone() {
    this.httpService.getZone().subscribe(
      data => {
        const res: any = data;
        if (res.zoneList) {
          localStorage.setItem('zoneList', JSON.stringify(res.zoneList));
          localStorage.setItem('assetList', JSON.stringify(res.assetList));
          localStorage.setItem('channelList', JSON.stringify(res.channelList));
        }
      },
      error => {
        error.status === 0 ? this.toastr.error('Please check Internet Connection', 'Error') : this.toastr.error(error.description, 'Error');
      }
    );
  }

 
  showChildModal(): void {
    this.childModal.show();
  }
 
  hideChildModal(): void {
    this.childModal.hide();
  }
}
