import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent implements OnInit {
  hideSideBar = false; // make default value to false after completing SMS manager;
  isTableauRequest = false;

  constructor(public router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        // tslint:disable-next-line:triple-equals
        if (
          e.url == "/dashboard/availability-dashboard" ||
          e.url == "/dashboard/rental-dashboard" ||
          e.url == "/dashboard/gt-dashboard" ||
          e.url == "/dashboard/mt-dashboard" ||
          e.url == "/dashboard/sss-gt-dashboard" ||
          e.url == "/dashboard/compliance-dashboard" ||
          e.url == "/dashboard/compliance-dashboard-national"
        ) {
          this.hideSideBar = true;
          this.isTableauRequest = true;
        }
      });
    // For Shop Detail Page, Tableau , Hide Side Bar
    let url: any = new Array();
    url = this.router.url.split(/[?/]/);
    const s: any = url.find((d) => d === "shop_detail");
    const r: any = url.find((d) => d === "details");
    const p: any = url.find((d) => d == "planogram-images");
    const i: any = url.find((d) => d == "instogram");
    const t: any = url.find((d) => d == "tableau");
    if (p || s || r || i || t) {
      this.hideSideBar = true;
      if(t){
        this.isTableauRequest=true;
      }
    }
  }

  hideBarStatus() {
    if (this.hideSideBar === true) {
      this.hideSideBar = false;
    } else {
      this.hideSideBar = true;
    }
  }
}
