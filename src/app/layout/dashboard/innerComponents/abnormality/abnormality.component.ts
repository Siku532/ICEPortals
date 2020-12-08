import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-abnormality",
  templateUrl: "./abnormality.component.html",
  styleUrls: ["./abnormality.component.scss"],
})
export class AbnormalityComponent implements OnInit {
  title = "";
  constructor() {
    if (localStorage.getItem("projectType") == "CCL") {
      this.title = "Shop Status Report";
    } else {
      this.title = "Abnormality Shop List";
    }
  }

  ngOnInit() {}
}
