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
  @Input("channelId") channelId: any;
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
  isNonSosDataAvailable = false;
  questionData: any;
  planogramList: any = [];
  isMtChannel=false;

  optionArray: any = [
    { id: 1, title: "Yes" },
    { id: 2, value: "No" },
  ];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private httpService: EvaluationService,
    private keyValuePipe: KeyValuePipe
  ) {
    this.evaluatorId = localStorage.getItem("user_id");
  }

  ngOnInit() {
    const arr = this.router.url.split("/");
    this.surveyId = +arr[arr.length - 1];
    this.evaluatorId = localStorage.getItem("user_id");
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data.currentValue) {
      this.data = changes.data.currentValue;
      this.products = this.data.mslTable || [];
      this.planogramList = JSON.stringify(this.data.planogramImageList);
      this.questionData =
        this.keyValuePipe.transform(this.data.questionData) || [];
      if (this.products.length > 0) {
        this.availability = this.getAvailabilityCount(this.products);
        this.facing = this.getFacingCount(this.products);
      }
      this.setDataSosWise();
    }

    if(this.channelId==1 || this.channelId==2 || this.channelId==3){
      this.isMtChannel=true;
    }
  }

  setSelectedImage(img) {
    this.selectedImage = img;
  }

  setDataSosWise() {
    for (const element of this.data.imageList) {
      if (element.isSosImage == "N") {
        this.selectedImage = element;
        break;
      }
    }
    for (const element of this.questionData) {
      if (element.value.isSos != "Y" && element.value.questionType != "image") {
        this.isNonSosDataAvailable = true;
        break;
      }
    }
    for (const element of this.questionData) {
      if (element.value.isSos == "Y") {
        this.isSosDataAvailable = true;
        break;
      }
    }
  }

  setUtilization() {
    if(this.isMtChannel){
      return this.calculateUtilizationBySkus();
    }
    else
    {
      return this.calculateUtilizationWithSos();
    }
  }

  calculateUtilizationBySkus(){
    let achieved=0;
    let com=0;
    for(const element of this.products){
      if(element.is_competition==1){
        achieved=achieved+Number(element.face_unit);
      }
      else if(element.is_competition==2){
        com=com+Number(element.face_unit);
      }
    }
    return this.getUtilizationPercentage(achieved,com);
  }

  calculateUtilizationWithSos(){
    let achievedSos = 0;
    let comSos = 0;
    for (const element of this.questionData) {
      if (element.value.isSos == "Y" && element.value.answer != null) {
        if (element.value.isSubQuestion == "nfl") {
          achievedSos = achievedSos + Number(element.value.answer);
        } else if (element.value.isSubQuestion == "competition") {
          comSos = comSos + Number(element.value.answer);
        }
      }
    }
    return this.getUtilizationPercentage(achievedSos, comSos);

  }

  getUtilizationPercentage(achieved, competition) {
    return (competition == 0 && achieved == 0
      ? 0
      : (achieved * 100) / (competition + achieved)
    ).toFixed(2);
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
      this.updatingMSL = true;

      this.colorUpdateList.push(value.id);
      const obj = {
        msdId: value.id,
        categoryTitle: this.data.sectionTitle,
        title: value.product_title,
        type: 1,
        newValue: !!value.available_sku ? 0 : 1,
        surveyId: value.survey_id,
        evaluatorId: this.evaluatorId,
      };

      // return value?'YES':'NO';

      this.httpService.updateData(obj).subscribe((data: any) => {
        if (data.success) {
          this.loading = false;
          this.toastr.success("Data Updated Successfully");
          const key = data.msdId;
          this.products.forEach((e) => {
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
                is_competition:e.is_competition,
                color: "red",
              };

              this.products.splice(i, 1, obj);

              // console.log(this.products[i])
            }

            // }

            this.availability = this.getAvailabilityCount(this.products);
            this.MSLNAvailabilityCount = this.getMSLNAvailbilityCount(
              this.products
            );
          });
        } else {
          this.toastr.error(data.message, "Update Data");
        }
      });
    }
  }

  changeFacing(value) {
    this.loading = true;
    if (this.isEditable) {
      this.changeColor = true;
      this.updatingMSL = true;
      if (value !== null) {
        this.colorUpdateList.push(value.id);
        const obj = {
          msdId: value.id,
          newValue: value.face_unit,
          categoryTitle: this.data.sectionTitle,
          title: value.product_title,
          type: 2,
          surveyId: value.survey_id,
          evaluatorId: this.evaluatorId,
        };

        // return value?'YES':'NO';

        this.httpService.updateData(obj).subscribe((data: any) => {
          if (data.success) {
            this.loading = false;
            this.toastr.success("Data Updated Successfully");
            // this.products=data.productList;
            const key = data.msdId;
            this.products.forEach((e) => {
              // for (const key of this.colorUpdateList) {
              if (key === e.id) {
                const i = this.products.findIndex((p) => p.id === key);
                const obj = {
                  id: e.id,
                  available_sku: e.available_sku,
                  MSL: e.MSL,
                  product_title: e.product_title,
                  face_unit: e.face_unit,
                  desired_facing: e.desired_facing,
                  category_title: e.category_title,
                  is_competition:e.is_competition,
                  color: "red",
                };

                this.products.splice(i, 1, obj);

                // console.log(this.products[i])
              }

              // }

              this.facing = this.getFacingCount(this.products);
            });
          } else {
            this.toastr.error(data.message, "Update Data");
          }
        });
      } else {
        this.toastr.error("Facing Value is Incorrect");
        this.loading = false;
      }
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
      this.childModal.show();
    }
  }
  hideChildModal() {
    this.childModal.hide();
  }

  updateTextData(value) {
    this.loading = true;
    if (value.answer != null && value.answer >= 0) {
      if (this.isEditable) {
        const obj = {
          msdId: value.id,
          newValue: value.answer,
          newValueId:-1,
          title: value.question,
          categoryTitle: this.data.sectionTitle,
          type: 8,
          evaluatorId: this.evaluatorId,
        };

        this.httpService.updateData(obj).subscribe((data: any) => {
          if (data.success) {
            this.loading = false;
            this.toastr.success("Data Updated Successfully");
            // const key = data.msdId;
            // this.questionData.forEach((e) => {
            //   // for (const key of this.colorUpdateList) {
            //   if (key == e.value.id) {
            //     const i = this.questionData.value.findIndex(
            //       (p) => p.value.id == key
            //     );
            //     const obj = {
            //       id: e.value.id,
            //       categoryId: e.value.categoryId,
            //       question: e.value.question,
            //       answer: e.value.answer,
            //       isSos: e.value.isSos,
            //       imageUrl: e.value.imageUrl,
            //       questionType: e.value.questionType,
            //       isSubQuestion: e.value.isSubQuestion,
            //       color: "red",
            //     };

            //     this.questionData.value.splice(i, 1, obj);
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

  updateMultiSelectData(value, data) {
    this.loading = true;
    let selectedOption;
    for(const option of data.optionList){
      if(value==option.id){
        selectedOption=option;
        break;
      }
    }
    if (value != null) {
      if (this.isEditable) {
        const obj = {
          msdId: data.id,
          title: data.question,
          categoryTitle: this.data.sectionTitle,
          newValueId: selectedOption.id,
          newValue: selectedOption.title,
          type: 4,
          evaluatorId: this.evaluatorId,
        };

        this.httpService.updateData(obj).subscribe((data: any) => {
          if (data.success) {
            this.loading = false;
            this.toastr.success("Data Updated Successfully");
            // const key = data.msdId;
            // this.questionData.forEach((e) => {
            //   // for (const key of this.colorUpdateList) {
            //   if (key === e.value.id) {
            //     const i = this.questionData.findIndex(
            //       (p) => p.value.id === key
            //     );
            //     const obj = {
            //       id: e.value.id,
            //       categoryId: e.value.categoryId,
            //       question: e.value.question,
            //       answer: e.value.answer,
            //       isSos: e.value.isSos,
            //       imageUrl: e.value.imageUrl,
            //       questionType: e.value.questionType,
            //       isSubQuestion: e.value.isSubQuestion,
            //       color: "red",
            //     };

            //     this.questionData.splice(i, 1, obj);
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

  navigateWithArray() {
    window.open(
      `${environment.hash}dashboard/evaluation/list/planogram-images?imageList=${this.planogramList}`,
      "_blank"
    );
  }
}
