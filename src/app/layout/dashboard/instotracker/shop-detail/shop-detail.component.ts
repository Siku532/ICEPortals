import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InstotrackerService } from 'src/app/layout/dashboard/instotracker/instotracker-service.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { config } from "src/assets/config";

@Component({
  selector: 'app-shop-detail',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.css']
})
export class ShopDetailComponent implements OnInit {

  @ViewChild('productDetailModal') productDetailModal: ModalDirective;


  allDataSelectedShop:any[]=[];
  selelctedShop:any={};
  singleShopSelected:true;
  selectedProduct: any={};
  ip = config.ip;
  loadingData: boolean=false;
  imageLoading: boolean=false;
  constructor(private generalService: InstotrackerService,private route:ActivatedRoute) { }

  ngOnInit() {

    this.allDataSelectedShop=JSON.parse(localStorage.getItem('allDataSelectedShop'));
    this.selelctedShop=JSON.parse(localStorage.getItem('selelctedShop'));
    console.log(this.allDataSelectedShop)
    this.route.params.subscribe(p=>{
      let id=+p['id'];
    console.log(id)

      if(!this.selelctedShop){
      this.loadingData=true;
        this.getDetailProdutsForShop(id);
      // localStorage.clear();
      }

     else if(this.selelctedShop.shopId!=id){
        this.loadingData=true;
          this.getDetailProdutsForShop(id);
        localStorage.clear();
        }
    })

  }
  getCategoryName(product) {

    return product.assetName;

  }
  getDetailProdutsForShop(shopId) {
    console.log('selected shopId ',shopId)

   let survayId= this.getMinimumSurveyId(this.allDataSelectedShop);
   debugger

    this.loadingData=true;
    this.generalService.getDetailDataForShop(shopId,survayId).subscribe(data => {
      console.log('selected data ',data)

      this.allDataSelectedShop = [];
      this.allDataSelectedShop = data;
      
      if(this.allDataSelectedShop.length>0)
      this.selelctedShop=this.allDataSelectedShop[0];

      this.loadingData=false;        

      
    }, error => {

    })
  }


  getMinimumSurveyId(data){
    debugger
    let list:any=[];
    data.forEach(e => {
      list.push(e.surveyId);
      
    });

    let d:any=(new Set(list))
    console.log("filter channels",d.length);
     let minNumber=Math.min.apply(null, d)

    return +minNumber;
      
  }
  showProductDetailModal(): void {
    this.productDetailModal.show();
  }

  hideProductDetailModal(): void {
    this.productDetailModal.hide();
  }
  getAlert(product) {
    this.selectedProduct = product;
    this.showProductDetailModal();
    this.imageLoading=true;
    setTimeout(() => {

      this.imageLoading=false;
      
    }, 2000);
  }


  goToSurvey(item){
    window.open(`${environment.hash}dashboard/evaluation/list/details/${item.surveyId}/${item.shopId}`, '_blank');
  }

}
