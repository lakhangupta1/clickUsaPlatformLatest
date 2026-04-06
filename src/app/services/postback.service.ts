import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class PostbackService {
  domain = "";
  constructor(private http: HttpClient, private Authentication: AuthenticationService) {
    this.domain = this.Authentication.getSubDomain();
  }

  createPostback(id, data) {
    return this.http.post(`${this.domain}/api/postback/create/${id}`, data);
  }

  allPostback() {
    return this.http.get(`${this.domain}/api/postback/show`);
  }

  showPostback(id) {
    return this.http.get(`${this.domain}/api/postback/show/${id}`);
  }

  deletePostback(id) {
    return this.http.delete(`${this.domain}/api/postback/delete/${id}`);
  }

  updatePostback(id, data) {
    return this.http.put(`${this.domain}/api/postback/update/${id}`, data);
  }

  getPostbackId(id) {
    return this.http.get(`${this.domain}/api/postback/status/${id}`);
  }

  getHoldPostback(id) {
    return this.http.get(`${this.domain}/api/hold/postback/data/${id}`);
  }

  getAllHoldPostback(pid) {
    return this.http.get(`${this.domain}/api/hold/postback/${pid}`);
  }

  saveHoldPostback(data) {
    return this.http.post(`${this.domain}/api/save/hold/postback`, data);
  }

  updateHoldPostback(id, data) {
    return this.http.post(`${this.domain}/api/update/hold/postback/${id}`, data);
  }

  deleteHoldPostback(id) {
    return this.http.delete(`${this.domain}/api/hold/postback/${id}`);
  }

}
