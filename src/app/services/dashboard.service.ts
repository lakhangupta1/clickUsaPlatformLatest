import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  domain: any = "";

  constructor(private http: HttpClient, authenticationService: AuthenticationService) { this.domain = authenticationService.getSubDomain(); }


  getPublisherDashboardData(filter) {
    return this.http.post<any>(this.domain + '/api/get/publisher/dashboard/data', filter);
  }

}
