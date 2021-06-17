import {Component, OnInit,ViewChild} from '@angular/core';
import {VirtualViewService} from '../virtual-view.service';
import { environment } from 'src/environments/environment';
import { MatCardModule } from '@angular/material/card';
import { config } from 'src/assets/config';
import { ToastrService } from 'ngx-toastr';
import * as moment from "moment";
import { NgModel } from '@angular/forms';
import { ModalDirective } from "ngx-bootstrap";
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from 'lodash';

@Component({
  selector: 'app-vo-tracking',
  templateUrl: './vo-tracking.component.html',
  styleUrls: ['./vo-tracking.component.scss']
})
export class VoTrackingComponent implements OnInit {
  @ViewChild("childModal") childModal: ModalDirective;
  title = 'VO Tracking';

  supervisor: any = [];
  surveyor: any = [];
  selectedRegionFilter: any = -1;
  selectedSupervisorFilter: any = -1;
  selectedSurveyorFilter: any = -1;
  selectedDe: any = -1;
  selectedDsr: any = -1;
  chooseDate = new Date();
  startDate = new Date();
  endDate = new Date();
  userType : any =-1;
  latitude;
  longitude;
  trackedShops: any = [];
  prodata: any = [];
  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  legends;
  projectType;

  colorType1 = '../../../../../assets/map-marker-icons/';
  colorType = config.ip + '/images/map-marker-icons/';
  loading = false;


  constructor(private httpService: VirtualViewService) {
  }

  ngOnInit() {
    // tslint:disable-next-line:radix
    
        this.getSupervisorData();
   
    
    this.latitude = 30.644579;
    this.longitude = 73.0948515;
    this.projectType=localStorage.getItem('projectType');
  }

  getSupervisorData() {
    this.loading = true;
    const obj = {
      act: 21,
      userType: parseInt(localStorage.getItem('user_type')),
      userId: parseInt(localStorage.getItem('user_id')),
      surveyorId: parseInt(localStorage.getItem('u_surveyor_id')),
    };
    this.httpService.getSupervisorList(obj).subscribe(data => {
      this.supervisor = data;
      this.loading = false;
    });
  }

  getSurveyourData() {
    this.loading = true;
    const obj = {
      act: 21,
      userType: parseInt(localStorage.getItem('user_type')),
      userId: parseInt(localStorage.getItem('user_id')),
      surveyorId: this.selectedSupervisorFilter,
    };
    this.httpService.getSupervisorList(obj).subscribe(data => {
      this.surveyor = data;
      this.loading = false;
    });
  }


  goToEvaluation(id, visitType) {
    window.open(`${environment.hash}dashboard/evaluation/list/details/${id}/${visitType}`, '_blank');
  }

  resetFilters() {
    this.selectedSupervisorFilter = -1;
    this.selectedSurveyorFilter = -1;
    this.startDate=new Date();
    this.prodata=-1
  }
  getShopsTracking() {
    
    if(this.selectedSurveyorFilter==-1)
    {
      this.loading = true;
      const obj = {
        supervisorId: this.selectedSupervisorFilter,
        surveyorId: this.selectedSurveyorFilter,
        startDate:moment(this.startDate).format('YYYY-MM-DD'),
        userId: localStorage.getItem('user_id'),
      };
      this.httpService.getShopsForTracking(obj).subscribe(res => {
        this.trackedShops = [];
        this.trackedShops = res;
        this.loading = false;
        this.latitude=this.trackedShops[0].latitude;
        this.longitude=this.trackedShops[0].longitude;
        const alldata = this.trackedShops.map((id) => {
          return id.shop_flag + ',' + id.shop_statuss ;
        
      });

      this.legends = new Set(alldata);
      });
      this.getProductivityData();
    }
    else
    {
      this.loading = true;
      const obj = {
        supervisorId: this.selectedSupervisorFilter,
        surveyorId: this.selectedSurveyorFilter,
        startDate:moment(this.startDate).format('YYYY-MM-DD'),
        userId: localStorage.getItem('user_id'),
      };
      this.httpService.getShopsForSurveyorTracking(obj).subscribe(res => {
        this.trackedShops = [];
        this.trackedShops = res;
        this.loading = false;
        this.latitude=this.trackedShops[0].latitude;
        this.longitude=this.trackedShops[0].longitude;
        const alldata = this.trackedShops.map((id) => {
          return id.shop_flag + ',' + id.shop_status ;
        
      });
     
      this.legends = new Set(alldata);
      });
      this.getProductivityData();
    }
    
  }
  getProductivityData() {
    const obj = {
      act: 22,
      supervisorId: this.selectedSupervisorFilter,
      surveyorId: this.selectedSurveyorFilter,
      startDate:moment(this.startDate).format('YYYY-MM-DD'),
      userId: localStorage.getItem('user_id'),
    };
    this.httpService.getProdata(obj).subscribe(data => {
      this.prodata = data;
    });
  }
}

