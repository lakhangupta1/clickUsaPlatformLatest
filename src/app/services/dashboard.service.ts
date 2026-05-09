import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  domain: any = "";

  constructor(private http: HttpClient, authenticationService: AuthenticationService) { this.domain = authenticationService.getSubDomain(); }


  getPublisherDashboardData(filter : any ) {
    return this.http.post<any>(this.domain + '/api/get/publisher/dashboard/data', filter);
  }
  getDashboardData(filter : any) {
    return this.http.post<any>(this.domain + '/api/get/dashboard/data', filter);
  }

}
