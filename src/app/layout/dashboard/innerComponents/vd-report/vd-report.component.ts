import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DashboardDataService } from "../../dashboard-data.service";
import { config } from "src/assets/config";
import { ToastrService } from "ngx-toastr";
import { DashboardService } from "../../dashboard.service";
import * as moment from "moment";
import { NgModel } from "@angular/forms";

@Component({
  selector: 'app-vd-report',
  templateUrl: './vd-report.component.html',
  styleUrls: ['./vd-report.component.scss']
})
export class VdReportComponent implements OnInit {
  title = "VD Report";
  zonePlaceholder = "";
  regionPlaceholder = "";
  clusterPlaceHolder = "";

  tableData: any = [];
  // ip = environment.ip;
  configFile = config;
  ip: any = this.configFile.ip;
  projectType: any;

  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  zones: any = [];
  loadingData: boolean;
  regions: any = [];
  channels: any = [];

  selectedZone: any = {};
  selectedRegion: any = {};
  startDate = new Date();
  endDate = new Date();
  regionId = -1;

  loadingReportMessage = false;
  loading = true;

  clusterList: any = [];
  selectedCluster: any = {};
  clusterId: any;

  chillerList:any=[];
  selectedChiller:any={};

  constructor(
    private toastr: ToastrService,
    private httpService: DashboardService,
    public router: Router,
    private dataService: DashboardDataService,
    public activatedRoute: ActivatedRoute
  ) {
    this.zones = JSON.parse(localStorage.getItem("zoneList"));
    this.clusterList = JSON.parse(localStorage.getItem("clusterList"));
    this.projectType = localStorage.getItem("projectType");
    if (this.projectType == "NFL" || this.projectType == "NFL_SO") {
      this.zonePlaceholder = "Region";
      this.regionPlaceholder = "Zone";
    } else {
      this.zonePlaceholder = "Zone";
      this.regionPlaceholder = "Region";
    }
    this.clusterPlaceHolder = "Cluster";

    this.clusterId = localStorage.getItem("clusterId") || -1;
  }

  ngOnInit() {
    this.getChillerList();
  }

  getVDReport() {
    if (this.endDate >= this.startDate) {
      this.loadingData = true;
      this.loadingReportMessage = true;
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
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate).format("YYYY-MM-DD"),
        type:this.router.url == "/dashboard/vd-report-mt"? 1:2,
        chillerType: this.selectedChiller.title?
        this.selectedChiller.title=='All'?-1:
        this.selectedChiller.title:-1,
      };

      const url = "vd_report"; 
      const body = this.httpService.UrlEncodeMaker(obj);
      this.httpService.getKeyForProductivityReport(body, url).subscribe(
        (data) => {
          const res: any = data;

          if (res) {
            const obj2 = {
              key: res.key,
              fileType: res.fileType,
            };
            const url = "downloadReport";
            this.getproductivityDownload(obj2, url);
          } else {
            this.clearLoading();

            this.toastr.info(
              "Something went wrong,Please retry",
              "dashboard Data Availability Message"
            );
          }
        },
        (error) => {
          this.clearLoading();
        }
      );
    } else {
      this.clearLoading();
      this.toastr.info(
        "Something went wrong,Please retry",
        "dashboard Data Availability Message"
      );
    }
  }

 
  getproductivityDownload(obj, url) {
    const u = url;
    this.httpService.DownloadResource(obj, u);
    setTimeout(() => {
      this.loadingData = false;
      this.loadingReportMessage = false;
      this.httpService.updatedDownloadStatus(false);
    }, 1000);
  }

  clearLoading() {
    this.loading = false;
    this.loadingData = false;
    this.loadingReportMessage = false;
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

  getChillerList() {
    this.httpService.getChillerList(-1).subscribe(
      (data) => {
        if (data) {
          this.chillerList = data;
        }
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
      }
    );
  }
}
