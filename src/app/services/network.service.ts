import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Observable, retry } from 'rxjs';
import { network_model } from '../shared/model/network.model';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  domain = "";

  constructor(private http: HttpClient, private Authentication: AuthenticationService) {
    this.domain = this.Authentication.getSubDomain();
  }
  network(network1: network_model) {
    return this.http.post<any>(this.domain + '/user/network/register', network1);
  }

  match_network(network_id) {
    return this.http.get<any>(this.domain + '/user/network_id/exists/' + network_id)
  }
  getNetworkByID(_id) {
    return this.http.get<any>(this.domain + '/user/network/data/' + _id)
  }


  getNetwork(): Observable<network_model> {
    return this.http.get<network_model>(this.domain + '/user/network/datalist/')
      .pipe(
        retry(1),
      )
  }



  getNetworkData(): Observable<network_model> {
    return this.http.get<network_model>(this.domain + '/api/network/list/')
      .pipe(
        retry(1),
      )
  }

  getNetworkDataSearch(list) {
    return this.http.post(this.domain + '/api/network/list/search/', list)
  }

  getThemeData(network_id) {
    // console.log("network_id-----",network_id);
    // return this.http.post(this.domain + '/api/network/get/theme/', { network_id: network_id })
    return this.http.post(this.domain + '/api/publisher/get/theme/', { network_id: network_id })
  }

  saveThemeData(obj) {
    return this.http.post(this.domain + '/api/network/save/theme/', obj)
  }

  getNetworkDetail() {
    return this.http.post(this.domain + '/api/network/list/search/', "")
      
  }

  deleteNetworkDetail(_id) {
    return this.http.delete<network_model>(this.domain + '/api/network/list/' + _id, this.httpOptions)
      .pipe(
        retry(1),
      )
  }

  updateNetworkDetail(networkdetial): Observable<network_model> {
    return this.http.put<network_model>(this.domain + '/api/network/list', networkdetial)
  }
  updateNetworkLogo(formdata) {
    return this.http.put<any>(this.domain + '/api/network/upload/logo/', formdata)

  }

  updateNetworkLogoSmall(formdata) {
    return this.http.put<any>(this.domain + '/api/network/upload/logo/small', formdata)
  }

  updateNetworkLogoMedium(formdata) {
    return this.http.put<any>(this.domain + '/api/network/upload/logo/medium', formdata)
  }

  saveNetworkSettings(data, custom, advertiser) {

    return this.http.post(this.domain + '/api/network/setting/save', { parameter: data, customParameters: custom, network_publisher_setting_string: advertiser, log_status: "Save Link Setting" })
  }
  saveNetworkPostbackForwarding(data) {
    return this.http.post(this.domain + '/api/network/postback/forwarding/save', data);
  }

  updateNetworkPostbackForwarding(data) {
    return this.http.post(this.domain + '/api/network/postback/forwarding/update', data);
  }

  getNetworkSettings() {
    return this.http.get(this.domain + '/api/get/network/setting')
  }
  getPublisherLinkSettings() {
    return this.http.get(this.domain + '/api/get/publisher/link/settings');
  }
  savedomain(data) {
    return this.http.post(this.domain + '/api/network/setting/savedomain', data);
  }

  setStatus(data) {
    return this.http.post(this.domain + '/user/network/status', data)

  }
  setOffer_export_setting(offerKey) {
    return this.http.post(this.domain + '/api/network/offer/setting/keys', offerKey);
  }
  setReport_export_setting(reportKey) {
    return this.http.post(this.domain + '/api/network/report/setting/keys', reportKey);
  }
  findNetworkOfferSetting() {
    return this.http.get(this.domain + '/api/get/offer/setting/keys');
  }
  findNetworkReportSetting() {
    return this.http.get(this.domain + '/api/get/report/setting/keys');
  }
  saveTimeZoneSetting(selectedTimeZone) {
    return this.http.post(this.domain + '/api/network/setting/save/timezone', { current_timezone: selectedTimeZone, log_status: "Save Time Zone Setting" });
  }

  getNetworkPostbackForwarding() {
    return this.http.get(this.domain + '/api/get/network/postback/forwarding/setting');
  }

  deleteNetworkPostbackForwarding(id) {
    return this.http.post(this.domain + '/api/delete/network/postback/forwarding/setting', { "postback_forwarding_setting_id": id });
  }

}
