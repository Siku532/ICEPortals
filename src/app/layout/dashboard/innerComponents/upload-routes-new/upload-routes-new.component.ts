import { Component, OnInit, ViewChild } from "@angular/core";
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
  loadingData: boolean;
  selectedRegionUp: any = new FormControl({}, [Validators.required]);
  selectedFile = new FormControl(null, [Validators.required]);
  selectedOption = new FormControl("", [Validators.required]);
  form: FormGroup;
  shopWiseCount: any = [];
  regionId = -1;
  regions: any = [];
  response: any = "";
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
  }
  ngOnInit() {
    this.getAllRegions();
  }

  showCount(action) {
    this.loadingData = true;
    if (this.regionId !== -1) {
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

  deleteRoutes(surveyorId, action) {
    this.loadingData = true;
    const obj = {
      surveyorId: surveyorId,
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

    if (
      post.selectedRegionUp !== {} &&
      this.form.get("avatar").value !== null
    ) {
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
    } else {
      this.loadingData = false;
      this.toastr.error("Plz fill all the required details");
    }
  }

  showErrorModal(): void {
    this.errorModal.show();
  }
  hideErrorModal(): void {
    this.errorModal.hide();
  }
}
