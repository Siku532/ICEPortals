import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject, of, BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { timeout, catchError } from 'rxjs/operators';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { config } from 'src/assets/config';
@Injectable({
  providedIn: 'root'
})
export class VirtualViewService {

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) {

  }
  ip: any = config.ip;
  private dataSource = new Subject();
  data = this.dataSource.asObservable();

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    withCredentials: true
  };


  getSupervisorList(obj) {

    const filter = JSON.stringify(obj);
    const url = this.ip + '/loadFilters';
    return this.http.post(url, filter);

  }
  getProdata(obj) {

    const filter = JSON.stringify(obj);
    const url = this.ip + '/loadFilters';
    return this.http.post(url, filter);

  }
  getShopsForTracking(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + '/vo-tracking';
    return this.http.post(url, body, this.httpOptions);
  }
  getShopsForSurveyorTracking(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + '/vo-tracking';
    return this.http.post(url, body, this.httpOptions);
  }
  UrlEncodeMaker(obj) {
    let url = '';
    for (const key in obj) {
      url += `${key}=${obj[key]}&`;
    }
    const newUrl = url.substring(0, url.length - 1);
    return newUrl;
  }
}
