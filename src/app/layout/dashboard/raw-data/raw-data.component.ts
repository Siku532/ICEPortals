import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DashboardService } from "../dashboard.service";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";

@Component({
  selector: "app-row-data",
  templateUrl: "./raw-data.component.html",
  styleUrls: ["./raw-data.component.scss"],
})
export class RawDataComponent implements OnInit {
  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  startDate = new Date();
  endDate = new Date();
  queryList: any = [];
  selectedQuery: any = {};
  loadingData: boolean;
  loadingReportMessage = false;
  p: any = {};
  reportId = -1;
  title = "";
  selectedReportUrl = "";
  clusterList:any=[];
  zones:any=[];
  regions:any=[];
  selectedZone:any={};
  selectedRegion:any={};
  selectedCluster:any={};
  clusterId:any;

  zonePlaceholder = "";
  regionPlaceholder = "";
  clusterPlaceHolder = "";
  projectType:any;
  queryParams:any=[];
  regionList:any=[];

  constructor(
    private activatedRoutes: ActivatedRoute,
    private httpService: DashboardService,
    public router: Router,
    private toastr: ToastrService
  ) {
    this.clusterList = JSON.parse(localStorage.getItem("clusterList"));
    this.zones = JSON.parse(localStorage.getItem("zoneList"));
    this.clusterId = localStorage.getItem("clusterId") || -1;
    this.projectType = localStorage.getItem("projectType");
    if (this.projectType == "NFL" || this.projectType == "NFL_SO") {
      this.zonePlaceholder = "Region";
      this.regionPlaceholder = "Zone";
    } else {
      this.zonePlaceholder = "Zone";
      this.regionPlaceholder = "Region";
    }
    this.clusterPlaceHolder = "Cluster";
  }

  ngOnInit() {
    this.activatedRoutes.params.subscribe((params) => {
      if (params.reportId) {
        this.reportId = params.reportId;
      }
      this.getQueryTypeList(this.reportId);
    });
    this.getAllRegions();
  }

  getQueryTypeList(reportId) {
    this.loadingData = true;
    this.httpService.getQueryTypeList(reportId).subscribe(
      (data) => {
        console.log("qurry list", data);
        if (data) {
          this.queryList = data;
          this.title =
            this.reportId > -1 ? this.queryList[0].title : "Raw Data";
          this.selectedQuery = this.queryList[0];
        }
        this.loadingData = false;
      },
      (error) => {
        this.loadingData = false;
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
      }
    );
  }

  getDashboardData() {
    if (this.endDate >= this.startDate) {
      this.loadingData = true;
      this.loadingReportMessage = true;
      // tslint:disable-next-line:triple-equals
      const obj = {
        queryId: this.selectedQuery.id,
        clusterId: this.selectedCluster.id
        ? this.selectedCluster.id == -1
          ? localStorage.getItem("clusterId")
          : this.selectedCluster.id
        : localStorage.getItem("clusterId"),
      zoneId: this.zoneCheck(),
      regionId: this.regionCheck(),
        startDate: this.selectedQuery.date=='Y'? moment(this.startDate).format("YYYY-MM-DD"): -1,
        endDate: this.selectedQuery.date=='Y'?moment(this.endDate).format("YYYY-MM-DD"):-1,
      };

      const url = "dashboard-data";
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
            // tslint:disable-next-line:triple-equals
            if (this.selectedQuery.type == 1) {
              this.selectedReportUrl = "downloadcsvReport";
            } else {
              this.selectedReportUrl = "downloadReport";
            }

            this.getproductivityDownload(obj2, this.selectedReportUrl);
          } else {
            this.clearLoading();

            this.toastr.info(
              "Something went wrong,Please retry",
              "Connectivity Message"
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
        "End date must be greater than start date",
        "Date Selection"
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
    this.loadingData = false;
    this.loadingReportMessage = false;
  }

  getZoneByCluster() {
    if(this.selectedQuery.zone=='Y'){
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
  }

  zoneChange() {
    if(this.selectedQuery.region=='Y'){
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

  }
  zoneCheck(){
    const zoneId=this.selectedZone.id
    ? this.selectedZone.id == -1
      ? localStorage.getItem("zoneId")
      : this.selectedZone.id
    : localStorage.getItem("zoneId");
    let zoneArray:any=[];
    if(zoneId==-1 && this.selectedQuery.zone=='Y'){
      this.zones.forEach((e) => {
        if(e.id!=-1){
          zoneArray.push(e.id);
        }
      });
      zoneArray=zoneArray.join();
      return zoneArray;
    }
    return zoneId;
  }
  regionCheck(){
    const regionId=this.selectedRegion.id
    ? this.selectedRegion.id == -1
      ? localStorage.getItem("regionId")
      : this.selectedRegion.id
    : localStorage.getItem("regionId");
    let regionArray:any=[];
    if(regionId==-1 && this.selectedQuery.region=='Y'){
      this.regions.forEach((e) => {
        if(e.id!=-1){
          regionArray.push(e.id);
        }
      });
      if(regionArray.length==0){
        this.regionList.forEach((e) => {
          if(e.id!=-1){
            regionArray.push(e.id);
          }
        });
      }
      regionArray=regionArray.join();
      return regionArray;
    }
    return regionId;
  }

  getAllRegions() {
    this.loadingData = true;
    this.httpService.getRegions().subscribe(
      (data) => {
        const res: any = data;
        if (res.regionList) {
          this.regionList = res.regionList;
        }
        if (!res.regionList) {
          this.toastr.info("No data Found For Regions", "Info");
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
}
