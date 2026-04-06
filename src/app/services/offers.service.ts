import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class OffersService {
  routeType = '';
  domain: any = '';

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
  ) {
    this.domain = authenticationService.getSubDomain();
    let userData = this.authenticationService.getUserDetails;
    if (userData) {
      if (userData.permissions.includes('network')) {
        this.routeType = "network";
        if (userData.loginType) {
          this.routeType = userData.loginType
        }
      }
      else if (userData.permissions.includes('publisher')) {
        this.routeType = 'publisher';
      }

    }
  }


  getOffers(data) {
    return this.http.post(this.domain + '/api/get/' + this.routeType + '/offers', data);
  }

  countOffers(data) {
    return this.http.post(this.domain + '/api/count/' + this.routeType + '/offers', data);
  }

  publisherApplyOffersRequest(data) {
    return this.http.post(this.domain + '/api/publisher/apply/offers/request', data);

  }

  getOneOfferDetails(id) {
    return this.http.get(this.domain + '/api/offer/show/' + id, {})
  }

  showPlatform(id) {
    return this.http.get(this.domain + '/api/platform/show/' + id);
  }

  exportPublisherOffer(data) {
    return this.http.post(this.domain + '/api/save/report', data);
  }

  getWorkingOffers(filterData: any) {
    return this.http.post(this.domain + '/api/' + this.routeType + '/offer/allOffers', filterData);
  }

}
