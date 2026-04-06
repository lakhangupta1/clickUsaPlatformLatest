import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  domain = "";

  constructor(private http: HttpClient,
    private authenticationService: AuthenticationService
  ) { this.domain = authenticationService.getSubDomain(); }

  getSummaries(data) {
    return this.http.post(this.domain + '/report/v1/get/advertiser/offer/publisher/source/summary', data);
  }
  getGrossSummaries(data) {
    return this.http.post(this.domain + '/report/v1/get/advertiser/offer/publisher/source/gross/summary', data);
  }
  saveSummaries(data) {
    return this.http.post(this.domain + '/report/v1/save/advertiser/offer/publisher/source/summary', data);
  }
  getPubSummaries(data) {
    return this.http.post(this.domain + '/report/v1/get/advertiser/offer/publisher/source/pubSummary', data);
  }
  getPubGrossSummaries(data) {
    return this.http.post(this.domain + '/report/v1/get/advertiser/offer/publisher/source/gross/pubSummary', data);
  }
  
  getGeoSummaries(data: any) {
    // console.log(" services log -> ", data);
    return this.http.post(this.domain + '/report/v1/get/advertiser/offer/publisher/source/geo/pubSummary', data);
  }
}
