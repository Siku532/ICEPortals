import {
  Component,
  OnInit,
  AfterViewChecked,
  Input,
  ViewChild,
} from "@angular/core";
import { DashboardService } from "../../dashboard.service";
import { DashboardDataService } from "../../dashboard-data.service";
import * as moment from "moment";
import { Router } from "@angular/router";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";
import { NgModel } from "@angular/forms";
import { ModalDirective } from "ngx-bootstrap";
import { config } from "src/assets/config";

@Component({
  selector: 'app-manage-vd',
  templateUrl: './manage-vd.component.html',
  styleUrls: ['./manage-vd.component.scss']
})
export class ManageVdComponent implements OnInit {
  chillerList:any=[];
  channelList:any=[];
  selectedChiller:any={};
  selectedChannel:any={};

  chillerProductList:any=[];
  updatedProductList:any=[];
  filteredProducts:any=[];
  selectedKeyword='';
  selectedProduct:any={};
  tmpProductList:any=[];

  loadingData:boolean;
  loading: boolean;
  loadingModalButton: boolean;

  @ViewChild("insertModal") insertModal: ModalDirective;

  form: FormGroup;

  constructor( private toastr: ToastrService,
    private httpService: DashboardService,
    public router: Router,
    private dataService: DashboardDataService,
    public formBuilder: FormBuilder) { 
    this.channelList=JSON.parse(localStorage.getItem('channelList'));
    this.form = formBuilder.group({
      title: new FormControl("", [Validators.required]),
      channelId: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit() {

  }

  getChillerList() {
    this.loadingData=true;
    this.httpService.getChillerList(this.selectedChannel.id || -1).subscribe(
      (data) => {
        if (data) {
          this.chillerList = data;
        }
        this.loadingData=false;
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
      }
    );
  }

  getChillerProductList() {
    this.loadingData=true;
    const obj={
      chillerId: this.selectedChiller.id,
      productId:this.selectedProduct.product_id || -1
    }
    this.httpService.getChillerProductList(obj).subscribe(
      (data) => {
        if (data) {
          this.chillerProductList = data;
          if(this.tmpProductList.length==0){
            this.filteredProducts=this.chillerProductList;
            this.tmpProductList=this.chillerProductList;
          }
        }
        this.loadingData=false;
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
      }
    );
  }

  changeProductStatus(event, item) {
    const obj={
      productMapId: item.product_type_map_id,
      active: event.checked? 'Y': 'N',
      chillerId: this.selectedChiller.id
    }
    const i = this.updatedProductList.findIndex((p) => p.productMapId == item.product_type_map_id);
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

hideInsertModal(){
    this.form.reset();
    this.insertModal.hide();
}

showInsertModal(){
  this.form.patchValue({
    channelId: this.selectedChannel.id
  });
  this.insertModal.show();
}

insertData(data) {
  this.loadingModalButton = true;
  const formData = new FormData();
  formData.append("formData", JSON.stringify(data));
  this.httpService.insertChiller(formData).subscribe((data: any) => {
    if (data.success == "true") {
      this.toastr.success(data.message);
      if(this.selectedChannel.id){
      this.getChillerList();
      }
      this.hideInsertModal();
    } else {
      this.toastr.error(data.message, "Error");
    }
    this.loadingModalButton = false;
  });
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
}
