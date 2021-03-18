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
  selector: 'app-upload-hurdle-rate',
  templateUrl: './upload-hurdle-rate.component.html',
  styleUrls: ['./upload-hurdle-rate.component.scss']
})
export class UploadHurdleRateComponent implements OnInit {
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
  projectType: any;
  zonePlaceholder = "";
  regionPlaceholder = "";
  constructor(
    private toastr: ToastrService,
    private httpService: DashboardService,
    public formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      avatar: null,
    });
    this.projectType = localStorage.getItem("projectType");
    if (this.projectType == "NFL" || this.projectType == "NFL_SO") {
      this.zonePlaceholder = "Region";
      this.regionPlaceholder = "Zone";
    } else {
      this.zonePlaceholder = "Zone";
      this.regionPlaceholder = "Region";
    }
  }
  ngOnInit() {
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
    formData.append("filePath", this.form.get("avatar").value);

    if (
      this.form.get("avatar").value !== null
    ) {
      this.loadingData = true;
      this.httpService.uploadHurdleRates(formData).subscribe((data) => {
        if (data) {
          this.response = data;
          if (this.response.length > 0) {
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

