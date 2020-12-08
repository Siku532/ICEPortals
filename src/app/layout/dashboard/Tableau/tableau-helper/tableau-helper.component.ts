import {
  Component,
  OnInit,
  AfterViewChecked,
  Input,
  ViewChild,
} from "@angular/core";
import { DashboardService } from "../../dashboard.service";
import { Router } from "@angular/router";
import { DashboardDataService } from "../../dashboard-data.service";
import { ToastrService } from "ngx-toastr";

declare var tableau: any;

@Component({
  selector: "tableau-helper",
  templateUrl: "./tableau-helper.component.html",
  styleUrls: ["./tableau-helper.component.scss"],
})
export class TableauHelperComponent implements OnInit {
  ticketUrl: string;
  @Input() type;
  constructor(
    private toastr: ToastrService,
    private httpService: DashboardService,
    public router: Router,
    private dataService: DashboardDataService
  ) {}

  ngOnInit(): void {
    this.getKey();
  }
  getKey() {
    const obj = {
      type: this.type,
      userType: localStorage.getItem("user_type"),
    };
    this.httpService.getKey(obj).subscribe((data: any) => {
      this.ticketUrl = `${data.TableauData.tableau_url}/${data.ticket}/${data.tableauPath}?iframeSizedToWindow=${data.TableauData.iframe}&:embed=${data.TableauData.embed}&:showAppBanner=${data.TableauData.showAppBanner}&:display_count=${data.TableauData.display_count}&:showVizHome=${data.TableauData.showVizHome}`;
      console.log("url:", this.ticketUrl);
      this.initViz();
    });
  }

  initViz() {
    const containerDiv = document.getElementById("vizContainer"),
      url = this.ticketUrl,
      options = {
        hideTabs: true,
        onFirstInteractive: function () {},
      };
    const viz = new tableau.Viz(containerDiv, url, options);
  }
}
