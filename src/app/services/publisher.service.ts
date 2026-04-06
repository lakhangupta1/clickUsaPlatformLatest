import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { PublisherModel } from '../shared/model/publisher';


@Injectable({
  providedIn: 'root'
})
export class PublisherService {
  domain = "";

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
    this.domain = this.authenticationService.getSubDomain();
  }

  getPublisher(id) {
    return this.http.get<any>(this.domain + '/api/get/publisher/' + id);
  }

  addPublisher(formData) {
    return this.http.post<any>(this.domain + '/api/add/publisher', formData);
  }

  updatePublisher(id, data) {
    return this.http.put<any>(this.domain + '/api/update/publisher/' + id, data);
  }

  updatePublisherAutoApprove(id, data) {
    return this.http.put<any>(this.domain + '/api/update/publisher/auto/approve/' + id, data);
  }



  list_Publisher_Account() {
    return this.http.get<any>(this.domain + '/api/publisher/accounts');
  }

  deletePublisherDetail(_id: string): Observable<PublisherModel> {
    return this.http.delete<PublisherModel>(this.domain + '/api/publisher/list/' + _id).pipe(retry(1))
  }

  getPublisherData() {
    return this.http.get(this.domain + '/api/publisher/list/')
  }

  getPublisherDetail(_id): Observable<PublisherModel> {
    return this.http.post<PublisherModel>(this.domain + '/api/publisher/list/' + _id, "").pipe(retry(1))
  }

  createApiCredentials(id) {
    return this.http.get(this.domain + '/api/credential/create/' + id);
  }

  updateApiCredentials(id) {
    return this.http.put(this.domain + '/api/credential/update/' + id, "");
  }
  getAllPublisher(advData, search, options) {
    return this.http.post(this.domain + '/api/publisher/view', { options: options, search: search });
  }
  getAllPublisherByName() {
    return this.http.get(this.domain + '/api/publisher/view/byname')
  }

  updatePublisherCutBack(id, data) {
    return this.http.put(this.domain + '/api/publisher/update/cutback/' + id, data)
  }

  getLoginPublisher() {
    return this.http.get(this.domain + '/api/publisher/get');
  }


  getOffers(data,domain) {
    return this.http.get<any>(`${domain}/publisher/offers/v2?${data.offer_type ? `offer_type=${data.offer_type}` : ''}&limit=${data.limit}&page=${data.page}`, {
      headers: { secretkey: data.secretkey, apikey: data.apikey }
    });
  }
  // getOffers(data, domain) {
  //   return this.http.get<any>(`${domain}/publisher/offers/v2?${data.offer_type ? `offer_type=${data.offer_type}&` : ''}limit=${data.limit}&page=${data.page}`,
  //     { headers: { secretkey: data.secretkey, apikey: data.apikey   } }
  //   );
  // }
}
