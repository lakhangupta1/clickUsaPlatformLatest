import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  domain = "";

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
    this.domain = this.authenticationService.getSubDomain();
  }

  getUserDetails(filter : any ){
    return this.http.post<any>(this.domain + '/api/get/all/users', filter);
  }
  getAllUserDetails(filter : any ){
    return this.http.post<any>(this.domain + '/api/get/users', filter);
  }
}
