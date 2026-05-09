import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments.prod';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  domain: any = '';
  constructor( private http: HttpClient, private authenticationService: AuthenticationService ) { 
    this.domain = this.authenticationService.getSubDomain();
  }


  createOrder(payload: any) {
    return this.http.post(`${this.domain}/api/payment/create-order`, payload);
  }
  verifyPayment(payload: any) {
    return this.http.post(`${this.domain}/api/payment/verify`, payload);
  }
}
