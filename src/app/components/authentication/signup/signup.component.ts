import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Globalconstant } from 'src/app/const/global';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule   // VERY IMPORTANT
  ],
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {

  @ViewChild('otpModal') otpModal!: TemplateRef<any>;

  otp: string = '';
  publisherRegisterForm!: FormGroup;
  logo: string = 'user1.jpg';
  isVerifying = false;
  isSubmitting: boolean = false;
  userEmail: string = '';
  private _signupRetried = false;
  countryList: any[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private toasterService: ToastrService,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private permissionsService : NgxPermissionsService
  ) {
    this.countryList = Globalconstant.config.country;
  }

  ngOnInit(): void {
    console.log(" countryList -> ", this.countryList ); 
    this.publisherRegisterForm = this.formBuilder.group({
      company: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone: ['', [Validators.required, Validators.pattern("^[6-9][0-9]{9}$")]],
      country: ['', Validators.required]
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.publisherRegisterForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  onSubmit() {
    // prevent multiple clicks
    if (this.isSubmitting) return;
    // form validation
    if (this.publisherRegisterForm.invalid) {
      this.toasterService.error('Please fill all fields correctly');
      return;
    }
    const formData = this.publisherRegisterForm.value;

    const payload = {
      company: formData.company?.trim(),
      first_name: formData.first_name?.trim(),
      last_name: formData.last_name?.trim(),
      name: `${formData.first_name?.trim()} ${formData.last_name?.trim()}`,
      email: formData.email?.trim(),
      phone: formData.phone,
      password: formData.password,
      country: formData.country
    };

    // store email for OTP verification step
    this.userEmail = payload.email;

    // log payload to help debugging backend validation errors
    // console.log('Signup Payload:', payload);

    this._signupRetried = false;
    this._doSignupRequest(payload, false);
  }

  private _doSignupRequest(payload: any, wrapped: boolean) {
    this.isSubmitting = true;
    const body = wrapped ? { userDetails: payload } : payload;

    this.authenticationService
      .signup(body)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (response: any) => {
          console.log('Signup Response:', response);

          if (response && response.err) {
            const msg = response.msg || response.message || 'Signup failed';
            this.toasterService.error(msg);
            return;
          }

          this.toasterService.success(response?.msg || 'OTP sent to email');

          if (!this.otpModal) {
            console.error('otpModal not found!');
            return;
          }

          this.modalService.open(this.otpModal, {
            size: 'sm',
            backdrop: 'static',
            centered: true,
          });
        },
        error: (err: any) => {
          console.log('FULL ERROR:', err);
          console.log('BACKEND RESPONSE:', err?.error);

          const backendMsg =
            err?.error?.msg || err?.error?.message || err?.message || err?.statusText || 'Something went wrong';

          // if 400 and we haven't retried yet, try wrapped payload shape
          if (err?.status === 400 && !this._signupRetried && !wrapped) {
            this._signupRetried = true;
            console.log('Retrying signup with wrapped payload { userDetails: ... }');
            this._doSignupRequest(payload, true);
            return;
          }

          if (err?.status === 400) {
            this.toasterService.error(backendMsg);
          } else if (err?.status === 0) {
            this.toasterService.error('Network error. Check your connection');
          } else if (err instanceof Error) {
            this.toasterService.error(err.message);
          } else if (backendMsg === 'User already exist') {
            this.toasterService.info(backendMsg);
          } else {
            this.toasterService.error(backendMsg);
          }
        },
      });
  }

  // login(userDetails) {
  //     return this.http.post(this.getSubDomain() + '/user/login', { userDetails }).pipe(map(user => {
  //       if (user['payload']) {
  //         localStorage.setItem('currentUser', JSON.stringify(user['payload'][0]));
  //         this.currentUserSubject.next(user['payload'][0]);
  //         const decoded = jwtDecode(user['payload'][0].token);
  //         this.details.next(decoded);
  //         const perm = decoded['permissions'];
  //         this.permissionsService.loadPermissions(perm);
  //       }
  //       return  user;
  //     }));
  //   }

  verifyOtpHandler(modal: any) {
    // Prevent multiple clicks
    if (this.isVerifying) return;
    // Validate OTP
    if (!this.otp || this.otp.length !== 6) {
      this.toasterService.error('Enter valid 6-digit OTP');
      return;
    }
    // ALWAYS prefer stored email (form may reset)
    const email = this.userEmail || this.publisherRegisterForm.value.email;
    if (!email) {
      this.toasterService.error('Session expired. Please signup again.');
      return;
    }
    const payload = {
      email: email,
      otp: String(this.otp).trim() // safe format
    };
    this.isVerifying = true;
    this.authenticationService.verifyOtp(payload).subscribe({
      next: (response: any) => {
        // console.log(" response -> ", response );
        this.isVerifying = false;
        // console.log("Verify OTP Response:", response);
        // SUCCESS
        if (response && !response.err) {
          this.toasterService.success(response.msg || 'OTP Verified');
          this.otp = ''; // reset input
          modal.close();
          //  Save token (IMPORTANT)
          const token = response.payload?.[0]?.token;
          const refreshToken = response?.payload?.[0]?.refreshtoken;
          // console.log(" token -> ", token );
          // console.log(" response ", response );
          if (token) {
            localStorage.setItem('currentUser', JSON.stringify(response['payload'][0]));
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
          }
          this.permissionsService.loadPermissions(['User']);
          // let preVisitedPath = sessionStorage.getItem("preVisitedPath") || "/dashboard";
          let preVisitedPath = "/dashboard";
          this.router.navigateByUrl(preVisitedPath);
        }else {
          // INVALID OTP
          this.toasterService.error(response?.msg || 'Invalid OTP');
        }
      },

      error: (error: any) => {
        this.isVerifying = false;

        console.log("FULL ERROR:", error);

        //Extract real backend message safely
        const backendMsg =
          error?.error?.msg ||
          error?.error?.message ||
          error?.message ||
          'OTP verification failed';

        // Handle status codes
        if (error?.status === 400) {
          this.toasterService.error(backendMsg);
        } else if (error?.status === 500) {
          this.toasterService.error('Server error. Please try again later');
        } else if (error?.status === 0) {
          this.toasterService.error('Network error. Check your connection');
        } else {
          this.toasterService.error(backendMsg);
        }
      }

    });
  }
}