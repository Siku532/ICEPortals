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

  constructor(
    private activatedRoutes: ActivatedRoute,
    private httpService: DashboardService,
    public router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.activatedRoutes.params.subscribe((params) => {
      if (params.reportId) {
        this.reportId = params.reportId;
      }
      this.getQueryTypeList(this.reportId);
    });
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
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate).format("YYYY-MM-DD"),
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
}
