import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ConversionLogService {
  domain = "";
  constructor(private http:HttpClient,
    private authenticationService:AuthenticationService
  ) { 
    this.domain= this.authenticationService.getSubDomain();
  }
  getConversionLog(filterData) {
    return this.http.post(this.domain + '/report/v1/conversion/view', filterData)
  }

  exportConversionLogForPublisher(filterData) {
    return this.http.post(this.domain + '/report/v1/save/conversion', filterData)
  }
}
