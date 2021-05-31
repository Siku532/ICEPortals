
import {Component, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { DashboardService } from "../../dashboard.service";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap";
import { DataAvailabilityComponent } from '../data-availability/data-availability.component';

@Component({
  selector: 'app-shop-wise-routes',
  templateUrl: './shop-wise-routes.component.html',
  styleUrls: ['./shop-wise-routes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ShopWiseRoutesComponent implements OnInit {
  @ViewChildren('checked') private myCheckbox: any;
  params:any;
  shopList:any=[];

  selectedShops:any=[];
  selectedShopList:any=[];

  loadingData=true;
  sortOrder = true;
  sortBy: "shopTitle";

  constructor(
    private httpService: DashboardService,
    private router: Router,
    private toastr: ToastrService,
    private activatedRoutes:ActivatedRoute
  ) { 
    this.activatedRoutes.params.subscribe((p) => {
      this.params = p;
      this.getData();
    });
  }

  ngOnInit() {
  }

  getData(){
    this.loadingData=true;
    const obj = {
     surveyorId: this.params.surveyorId || -1,
    };
    this.httpService.getShopWiseRoutes(obj).subscribe(
      (data) => {
        if (data) {
          this.shopList=data;
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
 

  checkUncheckSingle(event, item, index) {
    if (event.checked === true) {
      const i = this.selectedShops.findIndex((s) => s.surveyorRouteId== item.surveyor_route_id);
      if(i>-1){
        this.selectedShops[i].shopList.push(item.id);
      }
      else{
        this.selectedShopList.push(item.id);
        const obj={
          shopList:this.selectedShopList,
          surveyorRouteId: item.surveyor_route_id
        }
        this.selectedShops.push(obj);
      }
    } else {
      const i = this.selectedShops.findIndex((s) => s.surveyorRouteId== item.surveyor_route_id);
      const j = this.selectedShops[i].shopList.indexOf(item.id);
      this.selectedShops[i].shopList.splice(j, 1);
      if(this.selectedShops[i].shopList.length==0){
        this.selectedShops.splice(i,1);
      }
    }
    this.selectedShopList=[];
}


checkUncheckAll(event, routeId) {
    if (event.checked === true) {
        const i = this.shopList.findIndex((s) => s.route_surveyor_id== routeId);
        const j = this.selectedShops.findIndex((s) => s.surveyorRouteId== routeId);
        for(const shop of this.shopList[i].shopList){
          this.selectedShopList.push(shop.id);
        }
        if(j>-1){
          const obj={
            shopList: this.selectedShopList,
            surveyorRouteId: routeId
          }
          this.selectedShops.splice(j,1,obj);
        }
        else{
          const obj={
            shopList: this.selectedShopList,
            surveyorRouteId: routeId
          }
          this.selectedShops.push(obj);
        }
        for (let index = 0; index < this.myCheckbox._results.length; index++) {
          if(this.myCheckbox._results[index].name==routeId){
            this.myCheckbox._results[index]._checked = true;
          }
        }
        this.selectedShopList=[];
    } else {
          const i = this.selectedShops.findIndex((s) => s.surveyorRouteId== routeId);
          this.selectedShops.splice(i,1);
        for (let index = 0; index < this.myCheckbox._results.length; index++) {
          if(this.myCheckbox._results[index].name==routeId){
            this.myCheckbox._results[index]._checked = false;
          }
        }

    }
}

deleteRoutes() {
  this.loadingData = true;
  let shopArray=this.selectedShops;
  const obj = {
    routeList: this.setData(shopArray),
  };
  this.httpService.deleteShopWiseRoutes(obj).subscribe((data: any) => {
      if (data.success) {
        this.toastr.success(data.message);
        this.getData();
        this.selectedShops=[];
        this.uncheckCheckboxes();
      }
      else{
        this.toastr.error(data.message);
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

setData(shops){
  for(let i=0; i<shops.length; i++){
    const obj={
      surveyorRouteId: shops[i].surveyorRouteId,
      shopIds: shops[i].shopList.join()
    }
    shops.splice(i, 1 ,obj);
  }
  return shops;
}
uncheckCheckboxes(){

  for (let index = 0; index < this.myCheckbox._results.length; index++) {
      this.myCheckbox._results[index]._checked = false;
  }
}

 }



