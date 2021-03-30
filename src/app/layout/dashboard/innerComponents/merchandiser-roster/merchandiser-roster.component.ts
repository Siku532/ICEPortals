import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from '../../excel.service';

@Component({
  selector: 'app-merchandiser-roster',
  templateUrl: './merchandiser-roster.component.html',
  styleUrls: ['./merchandiser-roster.component.scss']
})
export class MerchandiserRosterComponent implements OnInit {

  title = 'Merchandiser Roster';
  minDate = new Date(2000, 0, 1);
  maxDate: any = new Date();
  startDate: any = new Date();
  endDate = new Date();
  selectedZone: any = {};
  userId: any;
  zones: any = [];
  selectedRegion: any = {};
  selectedId = -1;
  loadingReportMessage = false;
  downloadList = [{ key: 'xlsx', title: 'Excel', icon: 'fa fa-file-excel-o' }];
  selectedEvaluator: any = {};
  evaluatorList: any = [];
  userTypeId: any;
  ReEvaluatorId: any;
  obj: any = {};
  merchandiserList: any;
  myMap = new Map();
  loading = true;
  loadingData: boolean;
  regions: any = [];
  p = 1;
  selectedFileType: {};
  ids: Array<number>;
  flag = -1;
  totalEvaluated = 0;
  tmpTotal = 0;


  sortOrder = true;
  sortBy: 'merchandiser_code';
  constructor(private httpService: DashboardService, private toastr: ToastrService, private excelService: ExcelService) {
    this.ids = [1, 2, 3, 4, 5, 6, 7];
    this.zones = JSON.parse(localStorage.getItem('zoneList'));
  }

  ngOnInit() {
    this.loadingData = false;
    this.userTypeId = localStorage.getItem('user_type');
    this.ReEvaluatorId = localStorage.getItem('Reevaluator');
    this.sortIt('merchandiser_code');
    this.loadEvaluators();
    this.getMerchandiserList();
  }



  getMerchandiserList() {
    this.loadingData = true;
    // tslint:disable-next-line:triple-equals
    if (this.userTypeId == this.ReEvaluatorId) {
      this.obj = {
        evaluatorId: this.selectedEvaluator.id || -1,
        startDate: moment(this.startDate).format('YYYY-MM-DD'),
        endDate: moment(this.endDate).format('YYYY-MM-DD'),
        merId: this.selectedId
      };
    } else {
    this.obj = {
      evaluatorId: localStorage.getItem('user_id'),
      startDate: moment(this.startDate).format('YYYY-MM-DD'),
      endDate: moment(this.endDate).format('YYYY-MM-DD'),
      merId: this.selectedId
    };
  }

    this.httpService.getMerchandiserRoaster(this.obj).subscribe((data: any) => {
      // console.log('merchandiser list for evaluation',data);
      if (data) {
        this.myMap = data;
        this.loadingData = false;
        this.loading = false;
      }
    });
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

  getArrowType(key) {
    if (key === this.sortBy) {
      return this.sortOrder ? 'arrow_upward' : 'arrow_downward';
    } else { return ''; }
  }
  sortIt(key) {
    this.sortBy = key;
    this.sortOrder = !this.sortOrder;
  }

  loadEvaluators() {
    this.httpService.getEvaluatorList().subscribe(
      data => {
        if (data) { this.evaluatorList = data; }
      },
      error => {
        error.status === 0 ? this.toastr.error('Please check Internet Connection', 'Error') : this.toastr.error(error.description, 'Error');
      }
    );
  }

  downloadFile(file, dataTable) {
    // this.loading=true;
    console.log(file, dataTable);
    const type = file.key;
    const data: any = dataTable;
    const fileTitle = 'Merchandiser Roster';

    this.excelService.exportAsExcelFile(data, fileTitle);

    this.selectedFileType = {};
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }


  putValue(map, index) {
    for (const element of map) {
      // tslint:disable-next-line:triple-equals
      if (element.key == index) {
        this.tmpTotal = this.tmpTotal + element.value;
        return element.value;
      }
    }
    return '';
  }

  showTotal() {
    this.totalEvaluated = this.tmpTotal;
    this.tmpTotal = 0;
    return this.totalEvaluated;
  }
}
