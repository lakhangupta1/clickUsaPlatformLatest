import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ClickLogService {
  domain = "";
  constructor(private http:HttpClient,private authService:AuthenticationService) {
    this.domain = this.authService.getSubDomain();
   }
   getClickLog(filterData) {
    return this.http.post(this.domain + '/report/v1/click/view', filterData)
  }
}
