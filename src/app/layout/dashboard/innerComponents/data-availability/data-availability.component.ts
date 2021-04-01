import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { config } from "src/assets/config";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { NgModel } from "@angular/forms";
import { DashboardService } from "../../dashboard.service";
import { DashboardDataService } from "../../dashboard-data.service";
@Component({
  selector: "app-data-availability",
  templateUrl: "./data-availability.component.html",
  styleUrls: ["./data-availability.component.scss"],
})
export class DataAvailabilityComponent implements OnInit {
  title = "";
  zonePlaceholder = "";
  regionPlaceholder = "";
  clusterPlaceHolder = "";

  tableData: any = [];
  // ip = environment.ip;
  configFile = config;
  ip: any = this.configFile.ip;
  projectType: any;

  distributionList: any = [];
  selectedDistribution: any = {};
  selectedStoreType = null;
  //#region veriables
  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  zones: any = [];
  loadingData: boolean;
  regions: any = [];
  channels: any = [];

  selectedZone: any = {};
  selectedRegion: any = {};
  selectedChannel: any = [];
  startDate = new Date();
  endDate = new Date();
  areas: any = [];
  regionId = -1;

  selectedArea: any = {};
  mustHave: any = [];
  mustHaveAll: any = [];
  selectedMustHave = false;
  selectedMustHaveAll = "";
  cities: any = [];
  selectedCity: any = {};
  loadingReportMessage = false;
  loading = true;
  paramUrl: any;

  clusterList: any = [];
  selectedCluster: any = {};
  clusterId: any;

  params: any = {};
  constructor(
    private toastr: ToastrService,
    private httpService: DashboardService,
    public router: Router,
    private dataService: DashboardDataService,
    public activatedRoute: ActivatedRoute
  ) {
    this.zones = JSON.parse(localStorage.getItem("zoneList"));
    this.channels = JSON.parse(localStorage.getItem("channelList"));
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

    this.activatedRoute.params.subscribe((p) => {
      this.params = p;
    });
    this.title = "OOS Dashboard Report";
    if (this.params.regionId || this.params.clusterId) {
      this.startDate.setDate(this.startDate.getDate() - 1);
    }
    this.clusterId = localStorage.getItem("clusterId") || -1;
  }

  ngOnInit() {}

  getBrandSKUOOS() {
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
        channelId: this.arrayMaker(this.selectedChannel),
        cityId: this.selectedCity.id || -1,
        areaId: this.selectedArea.id || -1,
        mustHaveAll: this.selectedMustHaveAll || "",
      };

      const url =
        this.router.url == "/dashboard/brand_sku_oos" ||
        this.router.url == "/dashboard/brand_sku_oos_gt" ||
        this.router.url == "/dashboard/brand_sku_oos_so"
          ? "brandSKUOOS"
          : "brandSKUOOSNew";
      const body = this.httpService.UrlEncodeMaker(obj);
      this.httpService.getKeyForProductivityReport(body, url).subscribe(
        (data) => {
          console.log(data, "query list");
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

  getBrandSKUOOSByParams() {
    if (this.endDate >= this.startDate) {
      this.loadingData = true;
      this.loadingReportMessage = true;
      const obj = {
        zoneId: this.params.regionId || -1,
        clusterId: this.params.clusterId || -1,
        regionId: -1,
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.startDate).format("YYYY-MM-DD"),
        channelId: this.arrayMaker(this.selectedChannel),
        cityId: -1,
        areaId: -1,
        mustHaveAll: this.selectedMustHaveAll || "",
      };

      const url = this.params.regionId ? "brandSKUOOS" : "brandSKUOOSNew";
      const body = this.httpService.UrlEncodeMaker(obj);
      this.httpService.getKeyForProductivityReport(body, url).subscribe(
        (data) => {
          console.log(data, "query list");
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
    this.selectedArea = {};
    this.selectedCity = {};
    this.selectedDistribution = {};

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

  regionChange() {
    this.selectedArea = {};
    this.selectedCity = {};
    this.selectedDistribution = {};
    this.loadingData = true;

    console.log("regions id", this.selectedRegion);
    this.httpService.getCities(this.selectedRegion.id).subscribe(
      (data) => {
        // this.channels = data[0];
        const res: any = data;
        if (res) {
          this.areas = res.areaList;
          this.cities = res.cityList;
          this.distributionList = res.distributionList;
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
    this.selectedArea = {};
    this.selectedCity = {};
    this.selectedDistribution = {};
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
}
