import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { DashboardService } from '../../dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { ChartType, ChartOptions } from 'chart.js';
import * as moment from 'moment';
declare const google: any;
// tslint:disable-next-line: import-blacklist
import { Observable, interval } from 'rxjs';

import { Router } from '@angular/router';
import { checkAndUpdateTextDynamic } from '@angular/core/src/view/text';
import { positionElements } from 'ngx-bootstrap';
// import { Label } from 'ng2-charts';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit {


  constructor(private httpService: DashboardService, private router: Router,private toastr: ToastrService) { }

  tabsData: any = [];
  loading = true;
  date = Date();
  regions:any=[];
  selectedRegion:any={};




// doughnut chart
public doughnutChartLabels: any[] = [localStorage.getItem('projectType'), 'Competition', ];
  public doughnutChartData: any = [
    [350, 450]
  ];
  public doughnutChartType: ChartType = 'doughnut';

  public doughnutChartOptions: any = {
    type: 'doughnut',
    legend: {
      position: 'right',
    },
    tooltips: {
      callbacks: {
        afterLabel: function(tooltipItem, data) {
          const dataset = data['datasets'][0];
          const percent = Math.round((dataset['data'][tooltipItem['index']]));
          return '(' + percent + '%)';
        }
      }
    }
  };
// doughnut chart end
// pi cahrt
public pieChartOptions: ChartOptions = {
  responsive: true,
  legend: {
    position: 'right',
  },

  tooltips: {
    callbacks: {
      // title: function(tooltipItem, data) {
      //   return data['labels'][tooltipItem[0]['index']];
      // },
      // label: function(tooltipItem, data) {
      //   return data['datasets'][0]['data'][tooltipItem['index']];
      // },
      // afterLabel: function(tooltipItem, data) {
      //   const dataset = data['datasets'][0];
      //   const percent = Math.round((dataset['data'][tooltipItem['index']]));
      //   return '(' + percent + '%)';
      // }
    }
  },
  // plugins: {
  //   datalabels: {
  //     formatter: (value, ctx) => {
  //       const label = ctx.chart.data.labels[ctx.dataIndex];
  //       return label;
  //     },
  //   },
  // }
};
public pieChartLabels: any[] = [['MSL'], ['OOS']];
public pieChartData: number[] = [67, 100];
// public pieChartLabels2: any[] = [['CBL'], ['Competition']];
// public pieChartData2: number[] = [45,100];
public pieChartType: ChartType = 'pie';
public pieChartLegend = true;
// public pieChartPlugins = [pluginDataLabels];
public pieChartColors = [
  {
    //
    backgroundColor: ['#AFFCAF', '#FCAFAF'],
  },
];
public pieChartColors2 = [
  {
    backgroundColor: [ '#FFA726', '#00B8F0'],
  },
];

  ngOnInit() {
    this.getData();
    this.getAllRegions();
    interval(300000).subscribe(i => {this.getData(); });
    this.httpService.checkDate();
    // this.initMap()
    const userType = JSON.parse(localStorage.getItem('user_type'));

    if (userType === 16) {
      this.router.navigate(['/dashboard/merchandiser_List']);
    }
   
  }
public chartClicked( e: any ): void {
  if (e.active.length > 0) {
    const chart = e.active[0]._chart;
    const activePoints = chart.getElementAtEvent(e.event);
      if ( activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex];
        // get value by index
        const value = chart.data.datasets[0].data[clickedElementIndex];
        // console.log(clickedElementIndex, label, value)
        this.router.navigate(['/dashboard/msl_dashboard']);
      }
     }
}
// pie chart end




  getData() {
    this.tabsData = [];
    this.loading = true;
    const d = Date();
    const obj: any = {
      typeId: localStorage.getItem('user_type'),
      startDate: moment(d).format('YYYY-MM-DD'),
      regionId: this.selectedRegion.id || localStorage.getItem('regionId'),
      zoneId: localStorage.getItem('zoneId'),
      endDate: moment(d).format('YYYY-MM-DD'),
      userId: localStorage.getItem('user_id'),
    };
    this.httpService.getDashboardData(obj).subscribe(data => {
      console.log(data, 'home data');
      this.tabsData = data;
      this.loading = false;

      this.pieChartData = [this.tabsData.msl, 100 - this.tabsData.msl];
      this.doughnutChartData = [this.tabsData.sos, 100 - this.tabsData.sos];

    }, error => {
      console.log(error, 'home error');

    });

  }

  // initMap() {
  //   // The location of Uluru
  //   // var marksman = {lat: 31.502102, lng: 74.335109};
  //   var locations = [   ['kaddafi statuim stop', 31.511977, 74.328695, 1],
  //   ['Punjab college canal', 31.520024, 74.326554, 2],
  //   ['whadat road moor', 31.520600, 74.325095, 3],

  // ]
  //   // The map, centered at Uluru
  //   var map = new google.maps.Map(document.getElementById('map'), {zoom: 12, center: new google.maps.LatLng(31.504307, 74.331636)});
  //   // The marker, positioned at Uluru
  //   // var marker = new google.maps.Marker({position: marksman, map: map});
  //   var infowindow = new google.maps.InfoWindow();
  //   var marker, i ,markserList;
  //   for (i = 0; i < locations.length; i++) {
  //     var url="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
  //     if(i==2){
  //       url="http://maps.google.com/mapfiles/ms/icons/green-dot.png";
  //     }
  //     marker = new google.maps.Marker({
  //       position: new google.maps.LatLng(locations[i][1], locations[i][2]),
  //       center:new google.maps.LatLng(locations[i][1], locations[i][2]),
  //       map: map,
  //       icon: {
  //         url: url
  //       },
  //       radius:100
  //     });
  //     // markserList.push(marker)

  //     if(i==0){
  //       var cityCircle = new google.maps.Circle({
  //         strokeColor: '#FF0000',
  //         // strokeOpacity: 0.8,
  //         strokeWeight: 2,
  //         // fillColor: '#FF0000',
  //         // fillOpacity: 0.35,
  //         map: map,
  //         center: marker.center,
  //         radius: 100
  //       });
  //     }


  //     google.maps.event.addListener(marker, 'click', (function(marker, i) {
  //       return function() {
  //         infowindow.setContent(locations[i][0]);
  //         infowindow.open(map, marker);
  //       }
  //     })(marker, i));



  //     // marker.Circle.bindTo(new google.maps.LatLng(locations[i][1], locations[i][2]), marker, new google.maps.LatLng(locations[i][1], locations[i][2]));
  //   }

  //   // var bounds = new google.maps.LatLngBounds();
  //   // for (var j = 0; j < markserList.length; j++) {
  //   //  bounds.extend(markserList[j].getPosition());
  //   // }

  //   // map.fitBounds(bounds);

  // }

  getAllRegions() {
    this.loading = true;
    this.httpService.getRegions().subscribe(
      data => {
        const res: any = data;
        if (res.regionList) {
          this.regions = res.regionList;
          // localStorage.setItem('regionList', JSON.stringify(res.regionList));
        }
        if (!res.regionList) {
          this.toastr.info('No data Found', 'Info');
        }
        this.loading = false;


      },
      error => {
       this.loading=false;
        error.status === 0 ? this.toastr.error('Please check Internet Connection', 'Error') : this.toastr.error(error.description, 'Error');
      }
    );


  }
}
