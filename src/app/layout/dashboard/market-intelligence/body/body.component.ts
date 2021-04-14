import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MarketIntelligenceService } from "../market-intelligence-service.service";
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { NgxDrpOptions, PresetItem, Range } from 'ngx-mat-daterange-picker';
import { ModalDirective } from 'ngx-bootstrap';
import { config } from "src/assets/config";

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  //#region variables
  @ViewChild('dateRangePicker') dateRangePicker;
  @ViewChild('productDetailModal') productDetailModal: ModalDirective;

  range: Range = { fromDate: new Date(), toDate: new Date() };
  options: NgxDrpOptions;
  presets: Array<PresetItem> = [];

  allData: any = [];
  searchFilter = '';
  allDataClone: any[];



  p: number = 1;
  d: number = 1;
  filterModel: any = {};
  ip = config.ip;
  rangeDates: any;
  // range: any;
  filterProducts: any;
  singleShopSelected: boolean = false;
  selelctedShop: any = {};
  currentRange: any;
  loading = true;
  successTrigger = false;
  errorTrigger = false;
  myMessage: any;
  zones: any = [];
  selectedZone: any = {};
  loadingData :boolean;
  regions: any = [];
  selectedRegion: any = {};
  cities: any = []
  selectedCity: any = {};
  categories: any = [];
  selectedCategory = [];
  chanels: any = [];
  selectedChanel: any = {};
  wrongRange: boolean=false;
  filterData: any[]=[];
  selectedProduct: any={};
  allDataSelectedShop: any[]=[];
  imageLoading=false;
  channelName: string='';
  filterDataClone: any[]=[];
  user:any
  errorMessage: string;
  userId:any;


  //#endregion

  constructor(private route: ActivatedRoute, private generalService: MarketIntelligenceService) {  }

  ngOnInit() {
    this.user=localStorage.getItem("user_id");
    this.getZoneList();
    var d = new Date();
    var s = moment(d).subtract(1, 'day').format('YYYY-MM-DD');
    var e = moment(d).subtract(1, 'day').format('YYYY-MM-DD');
    this.currentRange = JSON.stringify({ startDate: s, endDate: e,userId:this.user });
    console.log('contructor date range', this.currentRange);
    this.getData(this.currentRange);
    this.currentRange = JSON.parse(this.currentRange)

    var e = moment(d).subtract(1, 'day').format('YYYY-MM-DD');
    const today = new Date();
    today.setDate(today.getDate()-1);
    const fromMin = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const fromMax = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const toMin = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const toMax = new Date(today.getFullYear(), today.getMonth() + 2, 0);

    this.setupPresets();
    this.options = {
      presets: this.presets,
      format: 'mediumDate',
      range: { fromDate: today, toDate: today },
      applyLabel: "Submit",
      calendarOverlayConfig: {
        shouldCloseOnBackdropClick: false,
        // hasBackDrop: false
      }
      // cancelLabel: "Cancel",
      // excludeWeekends:true,
      // fromMinMax: {fromDate:fromMin, toDate:fromMax},
      // toMinMax: {fromDate:toMin, toDate:toMax}
    };
  }

  //#region date range
  updateRange(range: Range) {
    this.loading = true;
    this.range = range;
    console.log("update range", this.range);
    var s = moment(this.range.fromDate).format('YYYY-MM-DD');
    var e = moment(this.range.toDate).format('YYYY-MM-DD');
    var maxDate=moment(this.range.fromDate).add(6,'days').format('YYYY-MM-DD');
    console.log('max Date', maxDate);

    this.currentRange = JSON.stringify({ startDate: s, endDate: e,userId:this.user });
    if (s <= e && e<=maxDate) {
      this.getData(this.currentRange);
    }

    else {

      this.errorMessage='Start-date can not be greater than end-date';

      if(e>maxDate)
      this.errorMessage='Only 7 days range is allowed';

      this.wrongRange = true;

      setTimeout(() => {
        this.wrongRange = false;

      }, 4000);
    }
    this.currentRange = JSON.parse(this.currentRange);

  }

  setupPresets() {

    const backDate = (numOfDays) => {
      const today = new Date();
      return new Date(today.setDate(today.getDate() - numOfDays));
    }

    const today = new Date();
    const yesterday = backDate(1);
    const minus7 = backDate(7)
    const minus30 = backDate(30);
    const currMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const currMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    // this.presets = [
    //   { presetLabel: "Yesterday", range: { fromDate: yesterday, toDate: today } },
    //   { presetLabel: "Last 7 Days", range: { fromDate: minus7, toDate: today } },
    //   { presetLabel: "Last 30 Days", range: { fromDate: minus30, toDate: today } },
    //   { presetLabel: "This Month", range: { fromDate: currMonthStart, toDate: currMonthEnd } },
    //   { presetLabel: "Last Month", range: { fromDate: lastMonthStart, toDate: lastMonthEnd } }
    // ]
  }
  // #endregion

  getShop(shop) {

    // console.log(shop);
    // this.allData = [];
    // this.allData = this.allDataClone;
    // this.singleShopSelected = true;
    this.selelctedShop = shop;
    localStorage.setItem('selelctedShop',JSON.stringify(this.selelctedShop))


    let filterData: any = [];
    filterData = this.allData.filter(d => d.shopId === shop.shopId);
    console.log("shopes", filterData)
    if (filterData.length > 0)
    {
      this.allDataSelectedShop = filterData;
      localStorage.setItem('allDataSelectedShop',JSON.stringify(this.allDataSelectedShop))
    }
      

      // window.scroll(0,0);

    window.open(environment.hash+'dashboard/instogram/shop/'+shop.shopId,'_blank')

  }

  getAllDataClassification(channelName:string){

    console.log(channelName);
    
    // console.log('filter data',this.filterData);
    // this.allData = this.allDataClone;
    this.channelName = channelName;
    this.allData = []

    if (this.filterData.length == 0) {

      let d = this.allDataClone.filter(d => d.channelName === channelName);
      this.allData = d;

    }
    else if (this.filterData.length > 0) {
      let d = this.filterData.filter(d => d.channelName === channelName);
      this.allData = d;

    }

    console.log('all data',this.allData);

        
  }

  categoryChange() {
    console.log(this.selectedCategory);
    this.allData = [];
    this.allData = this.allDataClone;
    let filterData: any = [];

    this.selectedCategory.forEach(e => {
      var ft = this.allData.filter(d => d.assetName === e.title && d.imageType === 'Primary');
      filterData.push(ft)

    });
    if (filterData[2]) {
      this.allData = filterData[0].concat(filterData[1]).concat(filterData[2]);
      console.log("triple filter list", this.allData)

    }
    else if (filterData[1]) {
      this.allData = filterData[0].concat(filterData[1]);
      console.log("double filter list", this.allData)


    }
    else if
      (filterData[0]) {
      this.allData = filterData[0];
      console.log("single filter list", this.allData)


    }


  }


  zoneChange() {
    // debugger
    this.regions = [];
    this.cities = [];
    this.chanels = [];
    // this.loadingData = true;
    this.allData = this.allDataClone;
    console.log('selected zone', this.selectedZone);
    this.filterData = [];
    this.generalService.getRegion(this.selectedZone.id).subscribe(data => {
      this.regions = data;
      // this.filterAllData();
    }, error => {

    });
    if (this.channelName)
      this.filterData = this.allData.filter(d => d.zone == this.selectedZone.title && d.channelName == this.channelName);

    else {
      this.filterData = this.allData.filter(d => d.zone == this.selectedZone.title);
      this.filterDataClone = this.filterData;
      
    }


    this.allData = this.filterData;
    this.loadingData = false;
    this.getUniqueChanelList(this.allData)

  }

  getCategoryName(product) {

    return product.assetName;//product.assetItemList[0].value;

  }

  regionChange() {
    this.loadingData = true;

    this.allData = this.allDataClone;
    this.filterData = [];
    // console.log('regions id', this.selectedRegion);
    this.generalService.getCities(this.selectedRegion.id).subscribe(data => {
      this.cities = data[0] || [];
      // console.log('cities list', data);
      // this.chanels = data[1];
      // this.filterAllData();

    }, error => {

    });


    if (this.channelName)
      this.filterData = this.allData.filter(d => d.zone == this.selectedZone.title && d.region == this.selectedRegion.title && d.channelName == this.channelName);

    else {
      this.filterData = this.allData.filter(d => d.zone == this.selectedZone.title && d.region == this.selectedRegion.title);
      this.filterDataClone = this.filterData;
    }


    this.allData = this.filterData;
    
    this.loadingData = false;
    this.getUniqueChanelList(this.allData)


  }

  cityChange() {
    this.loadingData = true;
    // console.log("seelcted city", this.selectedCity);
    this.allData = this.allDataClone;
    this.filterData = [];

    if (this.channelName)
      this.filterData = this.allData.filter(d => d.zone == this.selectedZone.title && d.region === this.selectedRegion.title && d.city == this.selectedCity.title && d.channelName == this.channelName);

    else {
      this.filterData = this.allData.filter(d => d.zone == this.selectedZone.title && d.region === this.selectedRegion.title && (d.city == this.selectedCity.title));
      this.filterDataClone = this.filterData;
    }

    this.allData = this.filterData;
    this.loadingData = false;
    this.getUniqueChanelList(this.allData)


  }

  chanelChange() {
  // console.log("seelcted chanel", this.selectedChanel);
    // this.generalService.getCategories(this.selectedChanel,this.uId).subscribe(data => {
    //   this.categories = data;
    //   // this.filterAllData();

    // }, error => { });
    this.allData = this.allDataClone;
    this.filterData = [];
    // console.log(this.allData[0])

    if (this.channelName)
      this.filterData = this.allData.filter(d => d.zone == this.selectedZone.title && d.region === this.selectedRegion.title && d.areaPmpkl == this.selectedChanel.areaPmpkl && d.channelName == this.channelName);

    else {
      this.filterData = this.allData.filter(d => d.zone == this.selectedZone.title && d.region === this.selectedRegion.title && d.areaPmpkl == this.selectedChanel.areaPmpkl);
      this.filterDataClone = this.filterData;
    }
    this.allData = this.filterData;
    this.getUniqueChanelList(this.allData)


  }

  getall() {
    this.singleShopSelected = false;

    if(this.filterData.length>0)
    this.allData = this.filterData;
    
    else
     this.allData=this.allDataClone;
}


  getZoneList() {
    this.generalService.getZone().subscribe((data: any) => {
       console.log('zone list', data)
      this.zones = data.zoneList;
    }, error => {
      // console.log("zone list error", error);
      // let er = JSON.parse(error._body)
      // this.myMessage = er.description//'Username OR password is invalid.';
      // this.errorTrigger = true;
      // this.loading = false;
      // setTimeout(() => {
      //   this.errorTrigger = false;

      // }, 3000);
    });
  }

  getData(range) {
    this.loadingData=true;
    this.selectedCity = {};
    this.selectedRegion = {};
    this.selectedCategory = [];
    this.selectedZone = {};
   this.allData=[];
   this.chanels=[];

    this.generalService.getDataByDateRange(range).subscribe(data => {
      this.allData =data;
      this.allDataClone = this.allData.slice();
      this.getUniqueChanelList(this.allDataClone)
      console.log(this.allData[0]);
      if (this.allData.length == 0) {
        this.successTrigger = true;
        this.myMessage = 'No Data Found';

      }
      this.loading = false;
      this.loadingData = false;

      // setTimeout(() => {
      //   this.loadingData = false;

      // }, 5000);

    }, error => {
      // console.log(error);
      // let er = JSON.parse(error._body)
      // this.myMessage = er.description//'Username OR password is invalid.';
      // this.errorTrigger = true;
      this.loading = false;
      setTimeout(() => {
        this.errorTrigger = false;

      }, 3000);

    });
  }

  getRandumHeightWidth() {
    // console.log('randum height',Math.floor(Math.random() * 40) + 300)
    return { height: Math.floor(Math.random() * 200) + 100 + 'px', width: Math.floor(Math.random() * 400) + 200 + 'px' }
    // ;
  }

  getAlert(product) {
    this.selectedProduct = product;
    this.showProductDetailModal();
    this.imageLoading=true;
    setTimeout(() => {

      this.imageLoading=false;
      
    }, 2000);
  }

  showProductDetailModal(): void {
    this.productDetailModal.show();
  }

  hideProductDetailModal(): void {
    this.productDetailModal.hide();
  }

  detDetailProdutsForShop(shop) {
    console.log('selected SHOP ',shop)

    this.loadingData=true;
    this.generalService.getDetailDataForShop(shop.shopId).subscribe(data => {
      console.log('selected data ',data)

      this.allDataSelectedShop = [];
      this.allDataSelectedShop = data
      this.loadingData=false;        

      
    }, error => {

    })
  }

  getSuperSearch(search){
    console.log(search.keyCode);

    if(search==''&& this.filterData)
    this.allData=this.filterData;

    else
    this.allData=this.allDataClone;
  
    
    if(this.searchFilter.length>1){
    this.loadingData=true;

      this.generalService.getSuperSearch(this.searchFilter).subscribe(data=>{
        console.log('search date',data)
        this.allData=data;
        this.loadingData=false;
      },error=>{});
    }
    else if(search.length<=1){
      this.allData=this.allDataClone;

    }
   
  }

  clearFilter(filter: string) {

    if (filter == 'all' || filter == 'selectedZone') {

      this.filterData = [];
      this.allData = this.allDataClone;

      this.selectedZone = {};
      this.selectedRegion = {};
      this.selectedChanel = {};
      this.selectedCity = {};

      this.regions = [];
      this.chanels = [];
      this.cities = [];
      if (filter == 'all'&& this.channelName) {
        this.channelName = '';   
            
      }
      // else {
      //   this.getAllDataClassification(this.channelName)
      // }
    }
    else if (filter == 'selectedRegion') {

      this.selectedRegion = {};
      this.selectedChanel = {};
      this.selectedCity = {};
      this.chanels = [];
      this.cities = [];
      this.zoneChange()

    }
    else if (filter == 'selectedChanel') {
      this.selectedChanel = {};
      this.regionChange()

    }

    else if (filter == 'selectedCity') {

      this.selectedCity = {};
      this.regionChange()

    }

    else if (filter == 'channelName') {
      debugger

      this.channelName = '';
      if (this.selectedZone  || this.selectedRegion  || this.selectedChanel   || this.selectedCity )
        this.allData = this.filterData || this.filterDataClone;

        else
        this.allData=this.allDataClone

    }

  }

  getUniqueChanelList(data:any){
    let list:any=[];
    data.forEach(e => {
      list.push(e.channelName);
      
    });

    let d=(new Set(list))
    console.log("filter channels",d);
    this.chanels=[];
    this.chanels=d;

  }

  goToSurvey(item){
    window.open(`${environment.hash}dashboard/evaluation/list/details/${item.surveyId}/${item.shopId}`, '_blank');
  }
}
