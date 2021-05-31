import { Injectable } from "@angular/core";
import * as moment from "moment";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { Location } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class DashboardGuard implements CanActivate {
  constructor(private router: Router, private location: Location) {}

  canActivate() {
    var t = moment(new Date()).format("YYYY-MM-DD");
    var st = localStorage.getItem("today");
    // tslint:disable-next-line:triple-equals
    if (
      (localStorage.getItem("isLoggedin") && t <= st) ||
      this.location.path().indexOf("/details/") > -1 ||
      this.location.path().indexOf("/brand_sku_oos_gt/") > -1 ||
      this.location.path().indexOf("/brand_sku_oos_imt/") > -1 ||
      this.location.path().indexOf("/brand_sku_oos_so/") > -1 ||
      this.location.path().indexOf("/tableau/") > -1
    ) {
      return true;
    }

    this.router.navigate(["/login"]);
    return false;
  }
}
