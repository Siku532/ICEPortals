import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-compliance-dashboard",
  templateUrl: "./compliance-dashboard.component.html",
  styleUrls: ["./compliance-dashboard.component.scss"],
})
export class ComplianceDashboardComponent implements OnInit {
  type = "compliance-dashboard";
  cluster: any;
  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.cluster) {
        this.cluster = params.cluster;
      } else if (
        localStorage.getItem("clusterName") != null &&
        localStorage.getItem("clusterName") != ""
      ) {
        this.cluster = localStorage.getItem("clusterName");
      }
    });
  }
  ngOnInit() {}
}
