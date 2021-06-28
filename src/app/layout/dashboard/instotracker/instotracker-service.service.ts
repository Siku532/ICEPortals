import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from "src/assets/config";

@Injectable({
  providedIn: 'root'
})
export class InstotrackerService {

  isUserExist = false;
  ip = config.ip;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };
  user: any = 0;
  constructor(private http: Http, private httpClient: HttpClient) {
    this.user=localStorage.getItem("user_id");

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };


  }

  isUserLoginIn() {
    return this.isUserExist;
  }

  headerCTJson() {
    let header = new Headers({ 'content-type': 'application/json' });
    // header.append("userId",'80')
    // let header = new Headers({'userId':localStorage.getItem('Authorized')})
    // new Headers({ 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    // 'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
    // 'Access-Control-Allow-Credentials': true });
    return header;
  }

  // public getData(){
  //   let url=this.ip+'shopFacia?regionId&zoneId&startDate=2018-07-01&endDate=2018-07-01&shopIds=undefined&assetIds=undefined&competId=1&primId=1&channelId=undefined&json=y';
  //   // let httpOption = this.headerCTJson();
  //   // const option = new RequestOptions({ headers: httpOption });
  //   return this.http.post(url,null).map(
  //     response => response.json()
  //   );
  // }

  public getDataByDateRange(range: any) {
    let url = this.ip + 'clientShopFacia';
    let httpOption = this.headerCTJson();
    const option = new RequestOptions({ headers: httpOption });
    return this.httpClient.post(url, range);


  }


  public getSingleShop(obj: any) {
    let url = this.ip + 'singleShop-images';
    let httpOption = this.headerCTJson();
    const option = new RequestOptions({ headers: httpOption });
    return this.httpClient.post(url, obj);


  }

  login(cradentials: any) {
    // console.log(cradentials)

    let url = this.ip + 'pictureLogin';
    let httpOption = this.headerCTJson();
    const option = new RequestOptions({ headers: httpOption });
    return this.http.post(url, cradentials).map(
      response => response.json()
    );

  }

  getZone() {
    var filter = JSON.stringify({ act: 0, userId: this.user });
    let url = this.ip + 'loadFilters';

    return this.httpClient.post(url, filter)

    // return this.http.post(url,filter).map(
    //   response => response.json()
    // );

  }

  getRegion(zoneId) {
    var filter = JSON.stringify({ act: 1, zoneId: zoneId, userId: this.user });
    let url = this.ip + 'loadFilters';
    return this.httpClient.post(url, filter)

  }

  getCities(regionId) {
    var filter = JSON.stringify({ act: 2, regionId: regionId, userId: this.user });
    let url = this.ip + 'loadFilters';
    return this.httpClient.post(url, filter)

  }

  getCategories(channelId) {
    var filter = JSON.stringify({ act: 3, channelId: channelId, userId: this.user });
    let url = this.ip + 'loadFilters';
    return this.httpClient.post(url, filter)

  }

  getDetailDataForShop(shopId: any, survayId?) {

    let obj = {
      shop_id: shopId,
      survey_id: -1,
      zone: '',
      region: '',
      city: '',
      channel_name: '',
      asset_name: '',
      image_type: '',
      userId: this.user

    }


    let url = this.ip + 'shopfacia-details';
    return this.http.post(url, JSON.stringify(obj)).map(
      response => response.json()
    );

  }


  getSuperSearch(search: String) {

    let obj = {
      shop_name: search,
      zone: '',
      region: '',
      city: '',
      channel_name: '',
      asset_name: '',
      image_type: '',
      userId: this.user

    }


    let url = this.ip + 'shopfacia-details';
    return this.http.post(url, JSON.stringify(obj)).map(
      response => response.json()
    );

  }
}
