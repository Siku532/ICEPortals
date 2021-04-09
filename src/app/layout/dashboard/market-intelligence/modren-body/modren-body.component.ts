import { Component, OnInit, ViewChild } from '@angular/core';
import { MarketIntelligenceService } from 'src/app/layout/dashboard/market-intelligence/market-intelligence-service.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { NgxDrpOptions, PresetItem, Range } from 'ngx-mat-daterange-picker';
import { ModalDirective } from 'ngx-bootstrap';
import { config } from "src/assets/config";


@Component({
  selector: 'modren-body',
  templateUrl: './modren-body.component.html',
  styleUrls: ['./modren-body.component.css']
})
export class ModrenBodyComponent implements OnInit {

  //#region variables
  @ViewChild('dateRangePicker') dateRangePicker;

  @ViewChild('productDetailModal') productDetailModal: ModalDirective;

  showProductDetailModal(): void {
    this.productDetailModal.show();
  }

  hideProductDetailModal(): void {
    this.productDetailModal.hide();
  }
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
  allDataSelectedShop: any = []

  regions: any = [];
  selectedRegion: any = {};
  cities: any = []
  selectedCity: any = {};

  categories: any = [];
  selectedCategory = [];

  chanels: any = [];
  selectedChanel: any = {};
  loadingData: boolean = true;
  selectedProduct: any = {};

  //#endregion

  constructor(private route: ActivatedRoute, private generalService: MarketIntelligenceService) {

    // this.categories = [
    //   { key: 'Gillette', value: 'Gillette' },
    //   { key: 'Laundry', value: 'Laundry' },
    //   { key: 'H&S', value: 'H&S' }
    // ];

  }

  ngOnInit() {
    this.getZoneList();
    var d = new Date();
    var s = moment(d).subtract(2, 'day').format('YYYY-MM-DD');
    var e = moment(d).subtract(1, 'day').format('YYYY-MM-DD');
    this.currentRange = JSON.stringify({ startDate: s, endDate: e });
    // console.log('contructor date range', this.range);
    this.getData(this.currentRange);
    this.currentRange = JSON.parse(this.currentRange)

    const today = new Date();
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

    this.currentRange = JSON.stringify({ startDate: s, endDate: e });
    console.log('contructor date currentRange', this.currentRange);
    this.getData(this.currentRange);
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

    this.presets = [
      { presetLabel: "Yesterday", range: { fromDate: yesterday, toDate: today } },
      { presetLabel: "Last 7 Days", range: { fromDate: minus7, toDate: today } },
      { presetLabel: "Last 30 Days", range: { fromDate: minus30, toDate: today } },
      { presetLabel: "This Month", range: { fromDate: currMonthStart, toDate: currMonthEnd } },
      { presetLabel: "Last Month", range: { fromDate: lastMonthStart, toDate: lastMonthEnd } }
    ]
  }
  // #endregion

  getShop(shop) {

    console.log(shop);
    this.allData = [];
    this.allData = this.allDataClone;
    this.singleShopSelected = true;
    this.selelctedShop = shop;
    let filterData: any = [];
    filterData = this.allData.filter(d => d.shopId === shop.shopId);
    console.log("shopes", filterData)
    if (filterData.length > 0)
      this.allDataSelectedShop = filterData;
  }

  detDetailProdutsForShop(shop) {
    this.loadingData=true;
    this.generalService.getDetailDataForShop(shop.shopId).subscribe(data => {
      this.allDataSelectedShop = [];
      this.allDataSelectedShop = data
      this.loadingData=false;        

      
    }, error => {

    })
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

  filterAllData() {
    this.loadingData = true;
    // this.allData = [];
    this.allData = this.allDataClone;
    let filterData: any = [];
    let zone = (this.selectedZone != {}) ? this.selectedZone.title : '';
    let region = (this.selectedRegion != {}) ? this.selectedRegion.title : '';
    let city = (this.selectedCity != {}) ? this.selectedCity.title : '';
    let chanel = (this.selectedChanel != {}) ? this.selectedChanel.title : '';

    console.log("current zone is", zone)
    console.log("current region is", region)
    console.log("current city is", city)

    let i = 0;
    this.allData.forEach(e => {
      if (zone != undefined && region == undefined && city == undefined && chanel == undefined)
        filterData = this.allData.filter(d => d.zone === zone);

      if (zone != undefined && region != undefined && city == undefined && chanel == undefined)
        filterData = this.allData.filter(d => d.zone === zone && d.region === region && chanel == undefined);

      if (zone != undefined && region != undefined && city != undefined && chanel == undefined)
        filterData = this.allData.filter(d => d.zone === zone && d.region === region && d.city === city);

      if (zone != undefined && region != undefined && city != undefined && chanel != undefined)
        filterData = this.allData.filter(d => d.zone === zone && d.region === region && d.city === city && d.channelName === chanel);

    });

    this.allData = filterData;

    setTimeout(() => {
      this.loadingData = false;
    }, 4000);

  }



  getAlert(product) {
    this.selectedProduct = product;
    this.showProductDetailModal()

  }

  zoneChange() {
    console.log('selected zone', this.selectedZone);
    this.filterAllData();

    this.generalService.getRegion(this.selectedZone.id).subscribe(data => {
      this.regions = data;

    }, error => {

    })
  }

  getCategoryName(product) {

    return product.assetItemList[0].value;

  }

  regionChange() {
    console.log('regions id', this.selectedRegion);
    this.filterAllData();
    this.generalService.getCities(this.selectedRegion.id).subscribe(data => {
      this.cities = data[0];
      console.log('cities list', data);
      this.chanels = data[1];
    }, error => {

    })
  }

  cityChange() {
    console.log("seelcted city", this.selectedCity);
    this.filterAllData();
  }

  chanelChange() {
    console.log("seelcted chanel", this.selectedChanel);
    this.filterAllData();
    this.generalService.getCategories(this.selectedChanel).subscribe(data => {
      this.categories = data;
    }, error => { })


  }

  getall() {
    this.allData = this.allDataClone;
    this.singleShopSelected = false;
  }


  getZoneList() {
    this.generalService.getZone().subscribe(data => {
      console.log('zone list', data)
      this.zones = data;
    }, error => {
      console.log("zone list error", error);
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
    this.selectedCity = {};
    this.selectedRegion = {};
    this.selectedCategory = [];
    this.selectedZone = {};

    this.generalService.getDataByDateRange(range).subscribe(data => {
      this.allData = data;
      this.allDataClone = this.allData.slice();
      // console.log(this.allData);
      if (this.allData.length == 0) {
        this.successTrigger = true;
        this.myMessage = 'No Data Found';

      }
      this.loading = false;
      setTimeout(() => {
        this.loadingData = false;

      }, 20000);

    }, error => {
      console.log(error);
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

  clearAllFilters() {
    this.loadingData = true;
    this.selectedZone = {};
    this.selectedRegion = {};
    this.selectedCity = {};
    this.selectedChanel = {};
    this.selectedCategory = [];
    setTimeout(() => {
      this.loadingData = false;
    }, 3000);
  }

}
