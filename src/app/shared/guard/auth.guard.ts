import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { Router } from "@angular/router";
import * as moment from "moment";
import { Location } from "@angular/common";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private location: Location) {}

  canActivate() {
    var t = moment(new Date()).format("YYYY-MM-DD");
    var st = localStorage.getItem("today");
    // if (t > st) this.router.navigate(['/login']);
    if (
      (localStorage.getItem("isLoggedin") && t <= st) ||
      this.location.path().indexOf("/details/") > -1
    ) {
      return true;
    }

    this.router.navigate(["/login"]);
    return false;
  }
}
