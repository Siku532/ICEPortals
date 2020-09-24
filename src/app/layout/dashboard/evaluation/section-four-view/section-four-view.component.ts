import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
declare const google: any;
@Component({
  selector: 'section-four-view',
  templateUrl: './section-four-view.component.html',
  styleUrls: ['./section-four-view.component.scss']
})
export class SectionFourViewComponent implements OnInit {

  @Input('data') data;
  locations: any = [];
  centerPoint: any = [];
  lat: any;
  long: any;
  mapSrc: SafeResourceUrl;
  url: any;

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.data = changes.data.currentValue;
    this.lat = this.data.mslTable[0].latitude;
    this.long = this.data.mslTable[0].longitude;

    this.url = 'https://maps.google.com/maps?q=' + this.lat + '%2C' + this.long + '&t=&z=13&ie=UTF8&iwloc=&output=embed';
    this.mapSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
}
