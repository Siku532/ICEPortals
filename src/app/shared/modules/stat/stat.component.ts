import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-stat",
  templateUrl: "./stat.component.html",
  styleUrls: ["./stat.component.scss"],
})
export class StatComponent implements OnInit {
  @Input() bgClass: string;
  @Input() icon: string;
  @Input() count: string;
  @Input() label: string;
  @Input() data: number;
  userType: any;
  evaluatorRole: any;
  reevaluatorRole: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.userType = localStorage.getItem("user_type");
    this.reevaluatorRole = localStorage.getItem("Reevaluator");
    this.evaluatorRole = localStorage.getItem("Evaluator");
  }

  goToProductivity() {
    // console.log('clicked')
    if (
      this.userType != this.evaluatorRole &&
      this.userType != this.reevaluatorRole
    ) {
      this.router.navigateByUrl("/dashboard/productivity_report");
    }
  }
}
