import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from '../../dashboard.service';
import { Router } from '@angular/router';
import { DashboardDataService } from '../../dashboard-data.service';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import * as moment from 'moment';

@Component({
  selector: 'app-supervisor-wwwr-summary',
  templateUrl: './supervisor-wwwr-summary.component.html',
  styleUrls: ['./supervisor-wwwr-summary.component.scss']
})
export class SupervisorWwwrSummaryComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private httpService: DashboardService,
    public router: Router,
    private dataService: DashboardDataService,
  ) { }

  loadingReportMessage = false;
  title = 'Supervisor WWWR Summary';
  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  startDate = new Date();
  endDate = new Date();
  selectedZone: any = {};
  selectedRegion: any = {};
  zoneList: any = [];
  loading = false;
  loadingData = false;
  regions: any = [];


  ngOnInit() {
    // this.getZone();
  }

  getZone() {
    this.httpService.getZone().subscribe(
      data => {
        const res: any = data;
        if (res.zoneList) {
          this.zoneList = res.zoneList;
        }
      },
      error => {
        this.clearLoading();

        error.status === 0 ? this.toastr.error('Please check Internet Connection', 'Error') : this.toastr.error(error.description, 'Error');
      }
    );
  }

  zoneChange() {
    this.loadingData = true;

    this.httpService.getRegion(this.selectedZone.id).subscribe(
      data => {
        const res: any = data;
        if (res) {
          this.regions = res;
        } else {
          this.clearLoading();

          this.toastr.info('Something went wrong,Please retry', 'Connectivity Message');
        }

        setTimeout(() => {
          this.loadingData = false;
        }, 500);
      },
      error => {
        this.clearLoading();
      }
    );
  }

  getSupervisorWWWRReport() {
    if (this.endDate >= this.startDate) {
      const obj = {
        startDate: moment(this.startDate).format('YYYY-MM-DD'),
        endDate: moment(this.endDate).format('YYYY-MM-DD'),
        zoneId: this.selectedZone.id || -1,
        regionId: this.selectedRegion.id || -1,
      };
      const url = 'supervisorWWWRSummary';

      this.httpService.DownloadResource(obj, url);
    } else {
      this.clearLoading();

      this.toastr.info('End date must be greater than start date', 'Date Selection');
    }
  }

  clearLoading() {
    this.loading = false;
    this.loadingData = false;
    this.loadingReportMessage = false;
  }

}
