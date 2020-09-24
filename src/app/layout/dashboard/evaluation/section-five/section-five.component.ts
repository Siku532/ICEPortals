import { Component, OnInit, EventEmitter, SimpleChanges, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EvaluationService } from '../evaluation.service';

@Component({
  selector: 'section-five',
  templateUrl: './section-five.component.html',
  styleUrls: ['./section-five.component.scss']
})
export class SectionFiveComponent implements OnInit {


  @Input('data') data;
  @Input('isEditable') isEditable :any;
  @Output('productList') productForEmit:any=new EventEmitter<any>();

  products: any=[];
  tagList:any=[]
  availability: any;
  changeColor: boolean;
  updatingMSL: boolean;
  colorUpdateList: any=[];
  surveyId: any;
  MSLCount: number=0;
  MSLNAvailabilityCount: number;

  constructor(private router:Router,private toastr:ToastrService,private httpService:EvaluationService,) { }

  ngOnInit() {
        var arr=this.router.url.split('/');
    this.surveyId=+arr[arr.length-1]
  }
  ngOnChanges(changes: SimpleChanges): void {
    
    this.data=changes.data.currentValue;
    this.products=this.data.mslTable || [];
    this.tagList=this.data.tagsList|| []
    if(this.products.length>0)
    this.availability=this.getAvailabilityCount(this.products);
    console.log('is editable',this.isEditable)
    this.MSLNAvailabilityCount=this.getMSLNAvailbilityCount(this.products)
    
  }

  getAvailabilityCount(products)
  {
    let sum=[]
    products.forEach(element => {
      if(element.available_sku==1)
      sum.push(element)
      
    });
    return sum.length;
  }
  getMSLNAvailbilityCount(products)
  {
    let pro=[];
    let msl=[];
    products.forEach(p=>{
      let obj={};
     if(p.MSL=='Yes'  && p.available_sku==1 ){
       obj={
         available_sku:p.available_sku,
         MSL:p.MSL
       }
       pro.push(obj)

     }

     if(p.MSL=='Yes'){
       msl.push(p)
     }
      
   })
  this.MSLCount=msl.length;
    return  pro.length;
  }

  updateString(value){
    return value?'Yes':'No';
  }

  // toggleValue(value){
  //   if(this.isEditable){
  //     this.changeColor=true;
  //     this.updatingMSL=true
     
  //     this.colorUpdateList.push(value.id)
  //     let obj={
  //       msdId:value.id,
  //       unitAvailable:!!value.available_sku? 0:1,
  //       surveyId:this.surveyId
  //     }
  //     // return value?'YES':'NO';
  
  // this.httpService.updateMSLStatus(obj).subscribe((data:any)=>{
  //   if(data.success){
  //     // this.products=data.productList;
  //     let key=data.msdId;
  
  //     this.products.forEach(e => {
  
  //     // for (const key of this.colorUpdateList) {
  //       if(key==e.id){
  //         var i=this.products.findIndex(p=>p.id==key);
  //         let obj={
  //           id:e.id,
  //           available_sku:(e.available_sku =='Yes')?e.available_sku ='No':e.available_sku ='Yes',
  //           MSL:e.MSL,
  //           product_title:e.product_title,
  //           category_title:e.category_title,
  //           color:'red'
  //         };
    
  //         this.products.splice(i,1,obj);

  //         // console.log(this.products[i])
  //       }
  //       localStorage.setItem('productList',JSON.stringify(this.products))

     
        
      
  //     // }
   
  //     this.availability=this.getAvailabilityCount(this.products)
  //     this.MSLNAvailabilityCount=this.getMSLNAvailbilityCount(this.products)
  
             
  //     });
  
  //     this.productForEmit.emit(this.products);
  //     // this.toastr.success('Status updated successfully.','Update MSL');
  //     this.updatingMSL=false;
  
  
  //   }
  //   else{
  //     this.toastr.error(data.message,'Update MSL')
  //   }
  // })
  
  //   }
   
  // }

}
