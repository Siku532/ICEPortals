import {
  Component,
  OnInit,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import { environment } from "src/environments/environment";
import { config } from "src/assets/config";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { EvaluationService } from "../evaluation.service";
import { ModalDirective } from "ngx-bootstrap";

@Component({
  selector: "section-eleven-view",
  templateUrl: "./section-eleven-view.component.html",
  styleUrls: ["./section-eleven-view.component.scss"],
})
export class SectionElevenViewComponent implements OnInit {
  @Input("data") data;
  // @ViewChild('childModal') childModal: ModalDirective;
  @ViewChild("childModal") childModal: ModalDirective;
  @Output("showModal") showModal: any = new EventEmitter<any>();
  @Input("isEditable") isEditable: any;
  @Output("assetTypeId") assetTypeForEmit: any = new EventEmitter<any>();
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
  availability: any;
  changeColor: boolean;
  updatingMSL: boolean;
  selectedProduct: any = {};
  colorUpdateList: any = [];
  selectedSku: any;
  surveyId: any;
  evaluatorId: any;
  MSLCount = 0;
  loadingData: boolean;
  loading = false;
  MSLNAvailabilityCount: number;
  facing: any;
  totalDesiredFacing: any;
  isSosDataAvailable = false;

  statusArray: any = [
    { title: "Yes", value: "1" },
    { title: "No", value: "0" },
  ];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private httpService: EvaluationService
  ) {}

  ngOnInit() {
    const arr = this.router.url.split("/");
    this.surveyId = +arr[arr.length - 1];
    this.evaluatorId = localStorage.getItem("user_id");
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data.currentValue) {
      this.data = changes.data.currentValue;
      this.products = this.data.mslTable || [];
      if (this.products.length > 0) {
        this.availability = this.getAvailabilityCount(this.products);
        this.facing = this.getFacingCount(this.products);
      }

      for (const element of this.data.imageList) {
        if (element.isSosImage == "N") {
          this.selectedImage = element;
          break;
        }
      }
      for (const element of this.data.tagsList) {
        if (element.isSosTag == "Y") {
          this.isSosDataAvailable = true;
          break;
        }
      }
    }
  }

  setSelectedImage(img) {
    this.selectedImage = img;
  }

  getAvailabilityCount(products) {
    const sum = [];
    products.forEach((element) => {
      if (element.available_sku > 0) {
        sum.push(element);
      }
    });
    return sum.length;
  }

  getFacingCount(products) {
    let sum = 0;
    products.forEach((el) => {
      sum = +el.face_unit + sum;
    });
    return sum;
  }

  getMSLNAvailbilityCount(products) {
    const pro = [];
    const msl = [];
    products.forEach((p) => {
      let obj = {};
      if (p.MSL === "Yes" && p.available_sku >= 1) {
        obj = {
          available_sku: p.available_sku,
          MSL: p.MSL,
        };
        pro.push(obj);
      }

      if (p.MSL === "Yes") {
        msl.push(p);
      }
    });
    this.MSLCount = msl.length;
    return pro.length;
  }

  updateString(value) {
    return value ? "Yes" : "No";
  }

  changeSku(value) {
    this.loading = true;
    if (this.isEditable) {
      this.changeColor = true;
      this.updatingMSL = true;

      this.colorUpdateList.push(value.id);
      const obj = {
        msdId: value.id,
        facing: -1,
        unitAvailable: !!value.available_sku ? 0 : 1,
        surveyId: this.surveyId,
        evaluatorId: this.evaluatorId,
      };

      // return value?'YES':'NO';

      this.httpService.updateMSLStatus(obj).subscribe((data: any) => {
        if (data.success) {
          this.loading = false;
          this.toastr.success("Data Updated Successfully");
          // this.products=data.productList;
          const key = data.msdId;
          this.products.forEach((e) => {
            // for (const key of this.colorUpdateList) {
            if (key == e.id) {
              const i = this.products.findIndex((p) => p.id == key);
              const obj = {
                id: e.id,
                available_sku:
                  e.available_sku == 0
                    ? (e.available_sku = 1)
                    : (e.available_sku = 0),
                MSL: e.MSL,
                product_title: e.product_title,
                face_unit: e.face_unit,
                desired_facing: e.desired_facing,
                category_title: e.category_title,
                color: "red",
              };

              this.products.splice(i, 1, obj);

              // console.log(this.products[i])
            }

            // }
          });
          this.availability = this.getAvailabilityCount(this.products);
          this.MSLNAvailabilityCount = this.getMSLNAvailbilityCount(
            this.products
          );
        } else {
          this.toastr.error(data.message, "Update Data");
        }
      });
    }
  }

  showChildModal(shop): void {
    this.selectedShop = shop;
    this.showModal.emit(this.selectedShop);
    // this.childModal.show();
  }

  showFacingChildModal(product) {
    if (this.isEditable) {
      this.selectedProduct = product;
      // if (this.selectedProduct.available_sku > 0 ) {
      //   this.selectedProduct.face_unit = 0;
      // } else {
      //   this.selectedProduct.face_unit = 1;
      // }
      this.childModal.show();
    }
  }
  hideChildModal() {
    this.childModal.hide();
  }
}
