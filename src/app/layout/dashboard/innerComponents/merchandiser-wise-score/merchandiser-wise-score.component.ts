import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-merchandiser-wise-score',
  templateUrl: './merchandiser-wise-score.component.html',
  styleUrls: ['./merchandiser-wise-score.component.scss']
})
export class MerchandiserWiseScoreComponent implements OnInit {
  title = 'Merchandiser Wise Score';
  minDate = new Date(2000, 0, 1);
  maxDate: any = new Date();
  startDate: any = new Date();
  endDate: any = new Date();
  loadingReportMessage = false;
  selectedEvaluator = -1;
  selectedZone: any = {};
  selectedRegion: any = {};
  evaluatorList: any = [];
  userTypeId: any;
  ReEvaluatorId: any;
  userId: any;
  merchandiserList: any = [];
  loading = true;
  loadingData: boolean;
  zones: any = [];
  regions: any = [];
  p = 1;
  sortOrder = true;
  sortBy: 'merchandiser_code';
  constructor(private httpService: DashboardService, private toastr: ToastrService, private router: Router) {
    this.maxDate.setDate(this.maxDate.getDate() - 1);
    this.startDate.setDate(this.startDate.getDate() - 1);
    this.startDate = moment(this.startDate).format('YYYY-MM-DD');
    this.endDate.setDate(this.endDate.getDate() - 1);
    this.endDate = moment(this.endDate).format('YYYY-MM-DD');
    this.zones = JSON.parse(localStorage.getItem('zoneList'));
  }



  ngOnInit() {
    this.loadingData = false;
    this.userTypeId = localStorage.getItem('user_type');
    this.ReEvaluatorId = localStorage.getItem('Reevaluator');
    this.getMerchandiserList();
    this.sortIt('merchandiser_code');
    this.userId = localStorage.getItem('user_id');
  }

  getArrowType(key) {
    if (key === this.sortBy) {
      return this.sortOrder ? 'arrow_upward' : 'arrow_downward';
    } else { return ''; }
  }
  sortIt(key) {
    this.sortBy = key;
    this.sortOrder = !this.sortOrder;
  }

  getMerchandiserList() {
    this.startDate = moment(this.startDate).format('YYYY-MM-DD');
    this.endDate = moment(this.endDate).format('YYYY-MM-DD');
    this.loadingData = true;
    if (this.endDate >= this.startDate) {
    const obj = {
      surveyorId: -1,
      startDate: this.startDate,
      endDate: this.endDate,
      zoneId: this.selectedZone.id || localStorage.getItem('zoneId'),
      regionId: this.selectedRegion.id || localStorage.getItem('regionId')
    };

    this.httpService.getMerchandiserWiseScore(obj).subscribe((data: any) => {
      // console.log('merchandiser list for evaluation',data);
      if (data) {
        this.merchandiserList = data;
        this.loading = false;
        this.loadingData = false;
      }
    });
  } else {
    this.loading = false;
    this.loadingData = false;
    this.toastr.info('End date must be greater than start date', 'Date Selection');
  }
  }

  modifyDate(date) {
    return moment(date).format('YYYY-MM-DD');
  }

  gotoNewPage(item) {
    // tslint:disable-next-line:whitespace
   window.open(`${environment.hash}dashboard/merchandiser_score?surveyorId=${item.surveyor_id}&startDate=${this.startDate}&endDate=${this.endDate}`, '_blank');

  }

    zoneChange() {
      this.loadingData = true;
        this.getMerchandiserList();

      this.httpService.getRegion(this.selectedZone.id).subscribe(
        data => {
          const res: any = data;
          if (res) {
            this.regions = res;
          } else {
            this.loadingData = false;
            this.loading = false;
            this.toastr.info('Something went wrong,Please retry', 'Connectivity Message');
          }

          setTimeout(() => {
            this.loadingData = false;
            this.loading = false;
          }, 500);
        },
        error => {
          this.loadingData = false;
          this.loading = false;
        }
      );
    }

  }
