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
import { config } from "src/assets/config";
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
  zonePlaceholder = "";
  regionPlaceholder = "";
  clusterPlaceHolder = "";

  tableData: any = [];
  projectType: any;

  zones: any = [];
  regions: any = [];
  channels: any = [];

  selectedZone: any = {};
  selectedRegion: any = {};
  selectedChannel: any = [];
  regionId = -1;

  clusterList: any = [];
  selectedCluster: any = {};
  clusterId: any;
  response:any;
  hurdleRateList:any=[];

  selectedKeyword='';
  filteredShops: any=[];
  selectedShop:any={};
  shops:any=[];

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
    this.clusterPlaceHolder = "Cluster";
    this.zones = JSON.parse(localStorage.getItem("zoneList"));
    this.channels = JSON.parse(localStorage.getItem("channelList"));
    this.clusterList = JSON.parse(localStorage.getItem("clusterList"));
    this.projectType = localStorage.getItem("projectType");
    this.clusterId = localStorage.getItem("clusterId") || -1;
  }
  ngOnInit() {
    // this.getShops();
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
      this.toastr.error("Please select a file");
    }
  }

  showErrorModal(): void {
    this.errorModal.show();
  }
  hideErrorModal(): void {
    this.errorModal.hide();
  }


  
  arrayMaker(arr) {
    const all = arr.filter((a) => a === "all");
    const result: any = [];
    if (all[0] === "all") {
      arr = this.channels;
    }
    arr.forEach((e) => {
      result.push(e.id);
    });
    return result;
  }

  selectAll(select: NgModel, values) {
    select.update.emit(values);
  }

  deselectAll(select: NgModel) {
    select.update.emit([]);
  }

  equals(objOne, objTwo) {
    if (typeof objOne !== "undefined" && typeof objTwo !== "undefined") {
      return objOne.id === objTwo.id;
    }
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
          this.clearLoading();

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
        this.clearLoading();
      }
    );
  }

  getZoneByCluster() {
    this.loadingData = true;
    this.selectedZone = {};
    this.selectedRegion = {};
    this.httpService.getZoneByCluster(this.selectedCluster.id || -1).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.zones = res;
        }
        this.loadingData = false;
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
        this.loadingData = false;
      }
    );
  }


  loadHurdleRate() {
    this.loadingData = true;
      const obj = {
        clusterId: this.selectedCluster.id
        ? this.selectedCluster.id == -1
          ? localStorage.getItem("clusterId")
          : this.selectedCluster.id
        : localStorage.getItem("clusterId"),
      zoneId: this.selectedZone.id
        ? this.selectedZone.id == -1
          ? localStorage.getItem("zoneId")
          : this.selectedZone.id
        : localStorage.getItem("zoneId"),
      regionId: this.selectedRegion.id
        ? this.selectedRegion.id == -1
          ? localStorage.getItem("regionId")
          : this.selectedRegion.id
        : localStorage.getItem("regionId"),
      channelId: this.arrayMaker(this.selectedChannel),
      shopId:this.selectedShop.id || -1,
      }
      this.httpService.getHurdleRates(obj).subscribe(
        (data) => {
          if (data) {
            this.hurdleRateList = data;
          }
          this.loadingData=false;
        },
        (error) => {
          error.status === 0
            ? this.toastr.error("Please check Internet Connection", "Error")
            : this.toastr.error(error.description, "Error");
            this.loadingData=false;
        }
      );
    }

    filterItem(value){
      if(value){
        value=value.toLowerCase();
      }
       this.filteredShops = Object.assign([], this.shops).filter(
          item => item.shop_name.toLowerCase().indexOf(value.toLowerCase()) > -1
       )
    }

    getShops(){
      this.loadingData=true;
      this.httpService.getAllShops(this.selectedZone.id || -1, this.selectedRegion.id || -1).subscribe(
            data => {
              const res: any = data;
              if (res) {
                this.shops = res;
                this.filteredShops=this.shops;
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
  }
