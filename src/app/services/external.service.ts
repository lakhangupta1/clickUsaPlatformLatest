import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ExternalService {
  domain = "";

  constructor(private http:HttpClient,
    authService:AuthenticationService
  ) { this.domain = authService.getSubDomain(); }
  
  saveExternalPublisher(data, hash) {
    return this.http.post(`${this.domain}/registerPublisher/add?token=${hash}`, data);
  }
  validateToken(token) {
    return this.http.get(`${this.domain}/registerPublisher/valid_token?token=${token}`)
  }
}
