import { Component, OnInit, Input, ViewChild, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { environment } from 'src/environments/environment';
import { config } from 'src/assets/config';

@Component({
  selector: 'section-two-view',
  templateUrl: './section-two-view.component.html',
  styleUrls: ['./section-two-view.component.scss']
})
export class SectionTwoViewComponent implements OnInit {

  @Input('data') data;
  @ViewChild('childModal') childModal: ModalDirective;
  @Output('showModal') showModal: any = new EventEmitter<any>();
  @Input('isEditable') isEditable: any;
  selectedShop: any = {};
  selectedImage: any = {};
  // ip=environment.ip;
  configFile = config;
  reevaluatorRole: any;
  userType: any;

  ip: any = this.configFile.ip;
  hover = 'hover';
  zoomOptions = {
    Mode: 'hover'
  };
  zoomedImage = 'https://image.shutterstock.com/image-photo/micro-peacock-feather-hd-imagebest-260nw-1127238569.jpg';


  constructor() { }

  ngOnInit() {
    this.reevaluatorRole = localStorage.getItem('Reevaluator');
    this.userType = localStorage.getItem('user_type');
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.data = changes.data.currentValue;
    this.selectedImage = this.data.imageList[0];

  }

  openSurvey(img) {
    // tslint:disable-next-line:triple-equals
    window.open(`${environment.hash}dashboard/evaluation/list/details/${img.surveyId}`, '_blank');

  }

  setSelectedImage(img) {
    this.selectedImage = img;
  }


  showChildModal(shop): void {
    this.selectedShop = shop;
    this.showModal.emit(this.selectedImage);

    // this.childModal.show();
  }

  hideChildModal(): void {
    // this.childModal.hide();
  }
}
