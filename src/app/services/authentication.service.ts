import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private details: BehaviorSubject<any>;
  private subDomain: BehaviorSubject<any>;
  public testDetails: Observable<any>;
  public apiSubDomain: Observable<any>;

  constructor(private http: HttpClient, private router: Router, private permissionsService: NgxPermissionsService) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.subDomain = new BehaviorSubject<any>(this.extractSubDomain());
    this.details = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.testDetails = this.details.asObservable();
    this.apiSubDomain = this.subDomain.asObservable();
    // Initialize permissions from stored user on service startup (handles hard reload)
    this._initPermissionsFromStorage();
  }

  private _initPermissionsFromStorage() {
    try {
      const saved = this.currentUserSubject.value;
      if (!saved) return;

      // If saved entry contains a token, decode it to extract permissions
      let perms: any = null;
      if (saved.token) {
        try {
          const decoded: any = jwtDecode(saved.token);
          // prefer decoded structure but fall back to any top-level permissions
          perms = decoded?.['userDetail']?.permissions || decoded?.permissions || null;
          // store decoded details for convenience
          this.details.next(decoded);
        } catch (e) {
          // ignore decode errors
        }
      }

      // If no token or decoded perms, check if stored user already has permissions
      if (!perms && saved.permissions) {
        perms = saved.permissions;
      }

      if (perms && Array.isArray(perms) && perms.length) {
        this.permissionsService.loadPermissions(perms);
      }
    } catch (e) {
      // noop
    }
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }
  public get getUserDetails() {
    try {
      if (this.details?.value?.token) {
        return jwtDecode(this.details?.value?.token);
      } else {
        return this.details.value;
      }
    } catch {
      return this.details.value;
    }
  }

  public getSubDomain() {
    try {
      if (this.subDomain.value) {
        return `${environment.scheme}${environment.apiUrl}`;
      } else {
        return `${environment.scheme}${environment.apiUrl}`;
      }
    } catch {
      return `${environment.scheme}${environment.apiUrl}`;
    }
  }

  extractSubDomain() {
    const full = window.location.host;
    const n = full.indexOf('localhost');
    let sub = '';
    if (n === -1) {
      sub = 'localhost';
    } else {
      const parts = full.split('.');
      if (parts[0] !== 'app') {
        sub = parts[0] + '.';
      }
    }
    return sub;
  }

  getDomain() {
    return window.location.host;
  }

  login(userDetails : any ) {
    return this.http.post(this.getSubDomain() + '/user/login', { userDetails }).pipe(map(user => {
      console.log(" user on login -> ", user );
      if (user['payload']) {
        localStorage.setItem('currentUser', JSON.stringify(user['payload'][0]));
        this.currentUserSubject.next(user['payload'][0]);
        const decoded = jwtDecode(user['payload'][0].token);
        this.details.next(decoded);
        console.log(" decoded login token -> ", decoded );
        const perm = decoded?.['userDetail']?.permissions;
        this.permissionsService.loadPermissions(perm);
      }
      return user;
    }));
  }

  // externalLogin(userDetails) {
  //   localStorage.setItem('currentUser', JSON.stringify(userDetails));
  //   this.currentUserSubject.next(userDetails);
  //   const decoded = jwtDecode(userDetails['token']);
  //   // console.log("Decode - ",decoded);
  //   this.details.next(decoded);
  //   const perm = decoded['permissions'];
  //   // console.log("Perm-- ",perm);
  //   this.permissionsService.loadPermissions(perm);
  // }

  // forgetPassword(userDetails) {
  //   return this.http.post(this.getSubDomain() + '/auth/forgetpassword', userDetails);
  // }

  // resetPassword(text) {
  //   return this.http.post(this.getSubDomain() + '/auth/checkurl', { link: text });
  // }

  // setPassword(data) {
  //   return this.http.post(this.getSubDomain() + '/auth/resetpassword', data);
  // }

  // removevalue() {
  //   return this.http.post(this.getSubDomain() + '/api/logout', { email: this.getUserDetails.userDetails.email });
  // }

  logout() {
    localStorage.removeItem('AccountToken');
    localStorage.removeItem('currentUser');
    // clear permissions on logout
    try { this.permissionsService.flushPermissions(); } catch (e) {}
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // networkLogin(userDetails) {
  //   return this.http.post(this.getSubDomain() + '/user/network/login', userDetails);
  // }

  signup(formData: any) {
    // console.log("formdata--",formData)
    return this.http.post(this.getSubDomain() + '/user/register', formData)
  }
  verifyOtp(otpData : any ){
    console.log(" otpData -> " , otpData );
    return this.http.post(this.getSubDomain() + '/user/verifyOtp', otpData);
  }
  
  // Adv_Register(userDetails: FormData, domain: string) {
  //   return this.http.post(this.getSubDomain() + '/registerAdvertiser/add/' + domain, userDetails);
  // }

}
