import { Component, OnInit, ViewChild,ViewChildren } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DashboardService } from "../../dashboard.service";
import { NgModel } from "@angular/forms";
import { ModalDirective } from "ngx-bootstrap";
@Component({
  selector: "app-upload-routes-new",
  templateUrl: "./upload-routes-new.component.html",
  styleUrls: ["./upload-routes-new.component.scss"],
})
export class UploadRoutesNewComponent implements OnInit {
  @ViewChild("errorModal") errorModal: ModalDirective;
  @ViewChildren('checked') private myCheckbox: any;
  loadingData: boolean;
  selectedRegionUp: any = new FormControl({}, [Validators.required]);
  selectedFile = new FormControl(null, [Validators.required]);
  selectedOption = new FormControl("", [Validators.required]);
  form: FormGroup;
  shopWiseCount: any = [];
  selectedSurveyors:any=[];
  regionId:any;
  regionIdTmp=-1;
  regions: any = [];
  response: any = "";
  projectType: any;
  zonePlaceholder = "";
  regionPlaceholder = "";
  isRegionRequired=true;
  constructor(
    private toastr: ToastrService,
    private httpService: DashboardService,
    public formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      selectedRegionUp: this.selectedRegionUp,
      selectedOption: this.selectedOption,
      avatar: null,
    });
    this.projectType = localStorage.getItem("projectType");
    if (this.projectType == "NFL" || this.projectType == "NFL_SO") {
      this.zonePlaceholder = "Region";
      this.regionPlaceholder = "Zone";
      this.isRegionRequired=false;
    } else {
      this.zonePlaceholder = "Zone";
      this.regionPlaceholder = "Region";
    }
  }
  ngOnInit() {
    this.getAllRegions();
  }

  showCount(action) {
    if(this.regionId){
      this.selectedSurveyors=[];
    this.loadingData = true;
      const obj = {
        regionId: this.regionId,
        action: action,
      };
      this.httpService.displayRouteStatus(obj).subscribe(
        (data) => {
          if (data) {
            this.shopWiseCount = data;
          }
          this.clearLoading();
        },
        (error) => {
          error.status === 0
            ? this.toastr.error("Please check Internet Connection", "Error")
            : this.toastr.error(error.description, "Error");
          this.clearLoading();
        }
      );
    }
  }

  deleteRoutes(action) {
    this.loadingData = true;
    const obj = {
      surveyorIds: this.selectedSurveyors,
      action: action,
    };
    this.httpService.updateRouteStatus(obj).subscribe(
      (data) => {
        if (data) {
          this.toastr.success("Routes Deactivated Successfully ");
          this.showCount("show");
        }
        this.clearLoading();
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
        this.clearLoading();
      }
    );
  }

  getAllRegions() {
    this.loadingData = true;
    this.httpService.getRegions().subscribe(
      (data) => {
        const res: any = data;
        if (res.regionList) {
          this.regions = res.regionList;
          // localStorage.setItem('regionList', JSON.stringify(res.regionList));
        }
        if (!res.regionList) {
          this.toastr.info("No data Found", "Info");
        }
        this.clearLoading();
      },
      (error) => {
        this.clearLoading();
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
      }
    );
  }

  clearLoading() {
    this.loadingData = false;
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get("avatar").setValue(file);
    }
  }

  uploadData(post) {
    const formData = new FormData();
    formData.append("cityId", post.selectedRegionUp);
    formData.append("newSurveyor", "No");
    // formData.append('startDate', post.date);
    formData.append("filePath", this.form.get("avatar").value);
    if(this.isRegionRequired=true && (post.selectedRegionUp==-1 || post.selectedRegionUp=={})){
      this.loadingData = false;
      this.toastr.error("Plz select a single "+this.regionPlaceholder+" to which the file is belonged");
    }
    else if( this.form.get("avatar").value == null){
      this.loadingData = false;
      this.toastr.error("Plz select a file to upload");
    }

   else {
      this.loadingData = true;
      this.httpService.uploadRoutes(formData).subscribe((data) => {
        if (data) {
          this.response = data;
          if (this.response.length > 0) {
            this.showCount("show");
            this.showErrorModal();
            this.loadingData = false;
            this.toastr.info(this.response, "Info");
          }
        } else {
          this.loadingData = false;
          this.toastr.error("There is an error in ur file!!");
        }
      });
    } 
  }

  showErrorModal(): void {
    this.errorModal.show();
  }
  hideErrorModal(): void {
    this.errorModal.hide();
  }


  
  checkUncheckSingle(event, item, index) {
    if (event.checked === true) {
        this.selectedSurveyors.push(item.surveyor_id);
    } else {
        const i = this.selectedSurveyors.indexOf(item.surveyor_id);
        this.selectedSurveyors.splice(i, 1);
    }
}


checkUncheckAll(event) {
    if (event.checked === true) {
        for (let i = 0; i < this.shopWiseCount.length; i++) {
          if(this.selectedSurveyors.indexOf(this.shopWiseCount[i].surveyor_id)==-1){
            this.selectedSurveyors.push(this.shopWiseCount[i].surveyor_id);
          }
        }
        for (let index = 0; index < this.myCheckbox._results.length; index++) {
            this.myCheckbox._results[index]._checked = true;
        }
    } else {
        for (let i = 0; i < this.shopWiseCount.length; i++) {
            const i = this.selectedSurveyors.indexOf('surveyor_id');
            this.selectedSurveyors.splice(i, 1);
            this.selectedSurveyors = [];
        }
        for (let index = 0; index < this.myCheckbox._results.length; index++) {
            this.myCheckbox._results[index]._checked = false;
        }

    }
}

}
