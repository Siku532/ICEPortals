import {
  Component,
  OnInit,
  Input,
  Output, EventEmitter
} from "@angular/core";
import { DashboardService } from "../../../dashboard.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { config } from 'src/assets/config';

@Component({
  selector: 'app-update-vd-product',
  templateUrl: './update-vd-product.component.html',
  styleUrls: ['./update-vd-product.component.scss']
})
export class UpdateVdProductComponent implements OnInit {
  @Input('chillerProductList') chillerProductList;
  @Input('selectedChiller') selectedChiller;

  updatedProductList:any=[];
  filteredProducts:any=[];
  selectedKeyword='';
  selectedProduct:any={};
  tmpProductList:any=[];

  loading: boolean;
  @Output('productChange') productChange: any = new EventEmitter<any>();

  ip=config.ip;


  constructor( private toastr: ToastrService,
    private httpService: DashboardService,
    public router: Router) {
  }

  ngOnInit() {
    if(this.tmpProductList.length==0){
      this.filteredProducts=this.chillerProductList;
      this.tmpProductList=this.chillerProductList;
    }
  }
 
  changeProductActiveStatus(event, item) {
    const i = this.updatedProductList.findIndex((p) => p.productMapId == item.product_type_map_id && p.chillerId==this.selectedChiller.id);
    const obj={
      productMapId: item.product_type_map_id,
      active: event.checked? 'Y': 'N',
      chillerId: this.selectedChiller.id,
      mustHave: i>-1? this.updatedProductList[i].mustHave : item.must_have
    }
    if(i>-1){
      this.updatedProductList.splice(i,1, obj);
    }
    else{
      this.updatedProductList.push(obj);
    }
    console.log(this.updatedProductList)
}

changeProductMSLStatus(event, item) {
  const i = this.updatedProductList.findIndex((p) => p.productMapId == item.product_type_map_id && p.chillerId==this.selectedChiller.id);
  const obj={
    productMapId: item.product_type_map_id,
    active: i>-1? this.updatedProductList[i].active : item.active,
    chillerId: this.selectedChiller.id,
    mustHave: event.checked? 'Y': 'N',
  }
  if(i>-1){
    this.updatedProductList.splice(i,1, obj);
  }
  else{
    this.updatedProductList.push(obj);
  }
  console.log(this.updatedProductList)
}

updateChillerData() {
  this.loading=true;
  const obj={
    productList: this.updatedProductList,
  }
  this.httpService.updateChillerProductList(obj).subscribe(
    (data:any) => {
      if (data.success) {
        this.toastr.success('Product Updated Successfully');
        this.updateData();
        this.updatedProductList=[];
      }
      else
      {
        this.toastr.error('There was an error updating the product');
      }
      this.loading=false;
    },
    (error) => {
      error.status === 0
        ? this.toastr.error("Please check Internet Connection", "Error")
        : this.toastr.error(error.description, "Error");
    }
  );
}

filterItem(value){
  if(value){
    value=value.toLowerCase();
  }
  if(value=='All'){
    this.filteredProducts=this.tmpProductList;
  }
   this.filteredProducts = Object.assign([], this.tmpProductList).filter(
      item => item.product_title.toLowerCase().indexOf(value.toLowerCase()) > -1
   )
}

emitChange(){
  this.productChange.emit(this.selectedProduct.product_id || -1)
}

updateData(){
  for( const element of this.updatedProductList){
    const i = this.chillerProductList.findIndex((p) => p.product_type_map_id == element.productMapId);
    const obj={
      product_type_map_id: element.productMapId,
      product_id: this.chillerProductList[i].product_id,
      product_title: this.chillerProductList[i].product_title,
      active: element.active,
      must_have: element.mustHave
    }
    this.chillerProductList.splice(i,1,obj);
  }
}
}
