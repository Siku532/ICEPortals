import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { DashboardService } from "../../dashboard.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap";

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class  ManageProductsComponent implements OnInit {
  @ViewChild("childModal") childModal: ModalDirective;
  channels:any=[];
  selectedChannel:any={};
  categoryList:any=[];
  loadingData:boolean;
  loadingModal:boolean;
  loadingModalButton:boolean;
  selectedProduct:any={};
  mslStatus: any=['Y','N'];
  activeStatus: any=['Y','N'];
  selectedMsl:any;
  selectedActiveStatus:any;
  sortOrder = true;
  sortBy: "productTitle";
  selectedProducts:any=[];

  constructor(
    private httpService: DashboardService,
    private router: Router,
    private toastr: ToastrService
  ) { 
    this.channels=JSON.parse(localStorage.getItem("channelList"));
  }

  ngOnInit() {
  }


  loadProducts() {
    this.selectedProducts=[];
    this.loadingData=true;
    const obj = {
     channelId: this.selectedChannel.id || -1,
    };
    this.httpService.getProductList(obj).subscribe(
      (data) => {
        if (data) {
          this.categoryList=data;
          this.getStats();
          
        }
        this.loadingData=false;
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
          this.loadingData=false;
      }
    );
  }

  showModal(product){
    this.selectedProduct=product;
    this.selectedMsl=product.mustHave;
    this.selectedActiveStatus=product.active;
    this.childModal.show();
  }
  hideModal(){
    this.childModal.hide();
  }

  updateCategory(){
    this.loadingModalButton=true;
    const obj = {
      products:this.selectedProducts,
    };
    this.httpService.updateCategory(obj).subscribe((data: any) => {
        if (data.success) {
          this.toastr.success("Product Updated Successfully")
            this.getStats();
            this.selectedProducts=[];
        }
        else{
          this.toastr.error("There was an error while updating the product");
        }
        this.hideModal();
        this.loadingModalButton=false;
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
          this.loadingModalButton=false;
      }
    );
  }
  getStats(){
    let prioritySkus=0;
    let totalSkus=0;
    let index=0;
    for(let element of this.categoryList){
      for(const product of element.productDataMap){
        if(product.mustHave=='Y'){
          prioritySkus=prioritySkus+1;
        }
        totalSkus=totalSkus+1;
      }
      const obj={
        id: element.id,
        assetTypeCategoryId: element.assetTypeCategoryId,
        categoryTitle: element.categoryTitle,
        productDataMap: element.productDataMap,
        totalMslProducts: prioritySkus,
        totalProducts:totalSkus,
      };
      this.categoryList.splice(index,1,obj);
      index++;
      prioritySkus=0;
      totalSkus=0;
    }
  }

  sortIt(key) {
    this.sortBy = key;
    this.sortOrder = !this.sortOrder;
  }

  getArrowType(key) {
    if (key === this.sortBy) {
      return this.sortOrder ? "arrow_upward" : "arrow_downward";
    } else {
      return "";
    }
  }
  spliceMsl(event,product){
    this.categoryList.forEach((e) => {
      if(product.assetTypeCategoryId==e.assetTypeCategoryId){
        const j=e.productDataMap.findIndex((c) => c.assetTypeCategoryId == product.assetTypeCategoryId 
        && c.productId==product.productId);
       const objProduct={
        productId: product.productId,
        assetTypeCategoryId: product.assetTypeCategoryId,
        productTitle: product.productTitle,
        mustHave: event.checked? 'Y': 'N',
        desiredFacing: product.desiredFacing,
        active: product.active,
       };
       this.selectedProduct=objProduct;
       e.productDataMap.splice(j, 1, objProduct)   
      }
    });
    this.changeMsl(this.selectedProduct);

  }

  spliceActive(event,product){
    this.categoryList.forEach((e) => {
      if(product.assetTypeCategoryId==e.assetTypeCategoryId){
        const j=e.productDataMap.findIndex((c) => c.assetTypeCategoryId == product.assetTypeCategoryId 
        && c.productId==product.productId);
       const objProduct={
        productId: product.productId,
        assetTypeCategoryId: product.assetTypeCategoryId,
        productTitle: product.productTitle,
        mustHave: product.mustHave,
        desiredFacing: product.desiredFacing,
        active: event.checked? 'Y': 'N',
       };
       this.selectedProduct=objProduct;
       e.productDataMap.splice(j, 1, objProduct)   
      }
    });
    this.changeActive(this.selectedProduct);
  }
  changeMsl(product){
    const i = this.selectedProducts.findIndex((p) => p.productId == product.productId);
    if(i>-1){
      const obj={
        productId:product.productId,
        assetTypeCategoryId: product.assetTypeCategoryId,
        msl:product.mustHave,
        active: product.active
      };
      this.selectedProducts.splice(i,1,obj);
  }
    else
    {
      const obj={
        productId:product.productId,
        assetTypeCategoryId: product.assetTypeCategoryId,
        msl:product.mustHave,
        active: product.active
      };
      this.selectedProducts.push(obj); 
}
}


  changeActive(product){
    const i = this.selectedProducts.findIndex((p) => p.productId == product.productId);
    if(i>-1){
      const obj={
        productId:product.productId,
        assetTypeCategoryId: product.assetTypeCategoryId,
        msl:product.mustHave,
        active: product.active
      };
      this.selectedProducts.splice(i,1,obj);
  }
    else
    {
      const obj={
        productId:product.productId,
        assetTypeCategoryId: product.assetTypeCategoryId,
        msl:product.mustHave,
        active: product.active
      };
      this.selectedProducts.push(obj); 
}
}
 }



