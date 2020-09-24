import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { EvaluationService } from '../evaluation.service';
import { ToastrService } from 'ngx-toastr';
import { config } from 'src/assets/config';

@Component({
  selector: 'section-nine-view',
  templateUrl: './section-nine-view.component.html',
  styleUrls: ['./section-nine-view.component.scss']
})
export class SectionNineViewComponent implements OnInit {

  @Input('data') data;
  @Input('productList') productList;
  @ViewChild('childModal') childModal: ModalDirective;
  @Output('showModal') showModal: any = new EventEmitter<any>();
  @Output('productList') productForEmit: any = new EventEmitter<any>();
  @Input('isEditable') isEditable: any;
  selectedShop: any = {};
  // ip=environment.ip;
  configFile = config;

  ip: any = this.configFile.ip;
  products: any = [];
  surveyId = 0;
  updatingMSL = false;
  changeColor = false;
  colorUpdateList: any = [];
  availability: any;


  constructor() {
    // var arr=router.url.split('/');
    // this.surveyId=+arr[arr.length-1]
    // console.log(this.surveyId)
   }



  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.data = changes.data.currentValue;
    // this.products=changes.productList.currentValue;
    // if(this.products.length>0)
    // this.availability=this.getAvailabilityCount(this.products);
    // console.log('is editable',this.isEditable)
    // this.getMSLCount(this.products)

  }
  showChildModal(shop): void {
    this.selectedShop = shop;
    this.showModal.emit(this.selectedShop);
    // this.childModal.show();
  }

  hideChildModal(): void {
    // this.childModal.hide();
  }





}
