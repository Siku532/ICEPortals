import {
  Component,
  OnInit,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { environment } from "src/environments/environment";
import { config } from "src/assets/config";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { EvaluationService } from "../evaluation.service";

@Component({
  selector: "section-ten-view",
  templateUrl: "./section-ten-view.component.html",
  styleUrls: ["./section-ten-view.component.scss"],
})
export class SectionTenViewComponent implements OnInit {
  @Input("data") data;
  @Input("evaluatorId") taggedEvaluatorId;
  // @ViewChild('childModal') childModal: ModalDirective;
  @Output("showModal") showModal: any = new EventEmitter<any>();
  @Input("isEditable") isEditable: any;
  @Output("productList") productForEmit: any = new EventEmitter<any>();
  selectedShop: any = {};
  selectedImage: any = {};
  // ip=environment.ip;
  configFile = config;

  ip: any = this.configFile.ip;
  hover = "hover";
  zoomOptions = {
    Mode: "hover",
  };
  zoomedImage =
    "https://image.shutterstock.com/image-photo/micro-peacock-feather-hd-imagebest-260nw-1127238569.jpg";
  products: any;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private httpService: EvaluationService
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data.currentValue) {
      this.data = changes.data.currentValue;
      this.selectedImage = this.data.imageList[0];
      this.products = this.data.mslTable || [];
      // this.MSLNAvailabilityCount = this.getMSLNAvailbilityCount(this.products);
    }
  }

  setSelectedImage(img) {
    this.selectedImage = img;
  }

  showChildModal(shop): void {
    this.selectedShop = shop;
    this.showModal.emit(this.selectedShop);
    // this.childModal.show();
  }
}
