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
import { KeyValuePipe } from "@angular/common";

@Component({
  selector: "section-nine-view",
  templateUrl: "./section-nine-view.component.html",
  styleUrls: ["./section-nine-view.component.scss"],
})
export class SectionNineViewComponent implements OnInit {
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
  formData: any;
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

  statusArray: any = [
    { title: "Yes", value: "1" },
    { title: "No", value: "0" },
  ];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private httpService: EvaluationService,
    private keyValuePipe: KeyValuePipe
  ) {
    this.evaluatorId = localStorage.getItem("user_id");
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data.currentValue) {
      this.data = changes.data.currentValue;
      this.formData = this.keyValuePipe.transform(this.data.formData) || [];
      this.selectedImage = this.data.imageList[0];
    }
  }

  unsorted() {}

  setSelectedImage(img) {
    this.selectedImage = img;
  }

  showChildModal(shop): void {
    this.selectedShop = shop;
    this.showModal.emit(this.selectedShop);
    // this.childModal.show();
  }

  hideChildModal() {
    this.childModal.hide();
  }

  updateMultiOptionData(value, data) {
    this.loading = true;
    if (value != null) {
      if (this.isEditable) {
        const obj = {
          msdId: data.id,
          newValue: value,
          type: 4,
          evaluatorId: this.evaluatorId,
        };

        this.httpService.updateData(obj).subscribe((data: any) => {
          if (data.success) {
            this.loading = false;
            this.toastr.success("Data Updated Successfully");
            // const key = data.msdId;
            // this.formData.forEach((e) => {
            //   // for (const key of this.colorUpdateList) {
            //   if (key == e.value.id) {
            //     const i = this.formData.findIndex((p) => p.value.id == key);
            //     const obj = {
            //       id: e.value.id,
            //       question: e.value.question,
            //       answer: e.value.answer,
            //       fieldType: e.value.fieldType,
            //       color: "red",
            //     };

            //     this.formData.splice(i, 1, obj);
            //   }

            //   // }
            // });
          } else {
            this.toastr.error(data.message, "Update Data");
          }
        });
      }
    } else {
      this.toastr.error("Value is Incorrect");
      this.loading = false;
    }
  }

  updateTextData(value) {
    this.loading = true;
    if (value.answer != null) {
      if (this.isEditable) {
        const obj = {
          msdId: value.id,
          newValue: value.answer,
          type: 8,
          evaluatorId: this.evaluatorId,
        };

        this.httpService.updateData(obj).subscribe((data: any) => {
          if (data.success) {
            this.loading = false;
            this.toastr.success("Data Updated Successfully");
            // const key = data.msdId;
            // this.formData.forEach((e) => {
            //   // for (const key of this.colorUpdateList) {
            //   if (key == e.value.id) {
            //     const i = this.formData.findIndex((p) => p.value.id == key);
            //     const obj = {
            //       id: e.value.id,
            //       question: e.value.question,
            //       answer: e.value.answer,
            //       fieldType: e.value.fieldType,
            //       color: "red",
            //     };

            //     this.formData.splice(i, 1, obj);
            //   }

            //   // }
            // });
          } else {
            this.toastr.error(data.message, "Update Data");
          }
        });
      }
    } else {
      this.toastr.error("Value is Incorrect");
      this.loading = false;
    }
  }
}
