import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { DashboardService } from "../../dashboard.service";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ModalDirective } from "ngx-bootstrap";

@Component({
  selector: 'app-manage-surveyors',
  templateUrl: './manage-surveyors.component.html',
  styleUrls: ['./manage-surveyors.component.scss']
})
export class ManageSurveyorsComponent implements OnInit {

  @ViewChild("surveyorInfoModal") surveyorInfoModal: ModalDirective;
  zonePlaceholder = "";
  regionPlaceholder = "";
  zones:any=[];
  regions:any=[];
  selectedZone:any={};
  selectedRegion:any={};
  surveyorList:any=[];
  loadingData:boolean;
  title='Manage Surveyors';
  projectType:any;
  sortOrder = true;
  sortBy: "m_code";
  form: FormGroup;
  loadingModal:boolean;
  loadingModalButton:boolean;
  activeStatus: any = ['Y','N'];
  
  constructor( private toastr: ToastrService,
    private httpService: DashboardService,
    public router: Router,
    public formBuilder: FormBuilder) { 
    this.zones = JSON.parse(localStorage.getItem("zoneList"));
    this.projectType=localStorage.getItem("projectType");
    if (this.projectType == "NFL" || this.projectType == "NFL_SO") {
      this.zonePlaceholder = "Region";
      this.regionPlaceholder = "Zone";
    } else {
      this.zonePlaceholder = "Zone";
      this.regionPlaceholder = "Region";
    }
    this.form = formBuilder.group({
      id: new FormControl(""),
      m_code: new FormControl(""),
      fullName: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
      email: new FormControl(""),
      phone: new FormControl(""),
      cnic: new FormControl(""),
      active: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit() {
  }

  zoneChange() {
    this.loadingData = true;
    this.selectedRegion = {};
    this.httpService.getRegion(this.selectedZone.id).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.regions = res;
        } else {
          this.loadingData=false;

          this.toastr.info(
            "Something went wrong,Please retry",
            "Connectivity Message"
          );
        }

        setTimeout(() => {
          this.loadingData = false;
        }, 500);
      },
      (error) => {
        this.loadingData=false;
      }
    );
  }

  loadSurveyors() {
    this.loadingData = true;
    this.httpService.getSurveyors(-1, this.selectedZone.id, this.selectedRegion.id).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.surveyorList=res
        }
        if (!res) {
          this.toastr.info("No data Found", "Info");
        }
        this.loadingData=false;
      },
      (error) => {
        this.loadingData=false;
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
      }
    );
  }

  getArrowType(key) {
    if (key === this.sortBy) {
      return this.sortOrder ? "arrow_upward" : "arrow_downward";
    } else {
      return "";
    }
  }
  sortIt(key) {
    this.sortBy = key;
    this.sortOrder = !this.sortOrder;
  }

  updateSurveyorData(data) {
    this.loadingModalButton = true;
    const formData = new FormData();
    formData.append("formData", JSON.stringify(data));
    this.httpService.updateSurveyorData(formData).subscribe((data: any) => {
      if (data.success == "true") {
        this.loadSurveyors();
        this.hideSurveyorInfoModal();
        this.toastr.success(data.message);
      } else {
        this.toastr.error(data.message, "Error");
      }
      this.loadingModalButton = false;
    });
  }

  showSurveyorInfoModal(surveyor){
    this.form.patchValue({
      id: surveyor.id,
      m_code: surveyor.m_code,
      fullName: surveyor.fullName,
      password: surveyor.password,
      email: surveyor.email,
      phone: surveyor.phone,
      active: surveyor.active,
      cnic: surveyor.cnic
    });
    this.surveyorInfoModal.show();
  }

  hideSurveyorInfoModal(){
      this.form.reset();
      this.surveyorInfoModal.hide();
  }

}
