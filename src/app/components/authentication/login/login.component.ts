import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { FeatherModule } from 'angular-feather';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, FeatherModule, RouterModule, ReactiveFormsModule, FormsModule, NgbModule]
})
export class LoginComponent implements OnInit {
  @ViewChild('forgotModal') forgotModal!: TemplateRef<any>;
  showPassword: boolean = false;
  logo: string = 'user1.jpg';
  isLoginFormSubmitted: boolean = false;
  loginForm!: FormGroup;
  domain: string = '';
  // Forgot-password flow
  forgotEmail: string = '';
  otp: string = '';
  userEmail: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  step: number = 1; // 1=email,2=otp,3=new password
  isSending: boolean = false;
  isVerifying: boolean = false;
  isResetting: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService
    ,
    private modalService: NgbModal
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/'])
    }
    this.domain = window.location.hostname;

  }

  openForgotModal() {
    this.forgotEmail = this.loginForm?.value?.email || '';
    this.step = 1;
    this.otp = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.userEmail = '';
    if (this.forgotModal) {
      this.modalService.open(this.forgotModal, { size: 'sm', backdrop: 'static', centered: true });
    }
  }

  sendResetEmail() {
    if (!this.forgotEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.forgotEmail)) {
      this.toastrService.error('Enter valid email');
      return;
    }
    this.isSending = true;
    const payload = { email: this.forgotEmail };
    this.authenticationService.forgetPassword(payload)
      .pipe(finalize(() => (this.isSending = false)))
      .subscribe({
        next: (res: any) => {
          if (res && !res.err) {
            this.toastrService.success(res.msg || 'OTP sent to email');
            this.step = 2;
            this.userEmail = this.forgotEmail;
          } else {
            this.toastrService.error(res?.msg || 'Failed to send OTP');
          }
        },
        error: (err: any) => {
          this.toastrService.error(err?.error?.msg || 'Failed to send OTP');
        },
      });
  }

  verifyOtpInModal(modal: any) {
    if (this.isVerifying) return;
    if (!this.otp || this.otp.length !== 6) {
      this.toastrService.error('Enter valid 6-digit OTP');
      return;
    }
    const payload = { email: this.userEmail, otp: String(this.otp).trim() };
    this.isVerifying = true;
    this.authenticationService.verifyOtpToForgotPassword(payload).subscribe({
      next: (res: any) => {
        this.isVerifying = false;
        if (res && !res.err) {
          this.toastrService.success(res.msg || 'OTP Verified');
          this.step = 3;
        } else {
          this.toastrService.error(res?.msg || 'Invalid OTP');
        }
      },
      error: (err: any) => {
        this.isVerifying = false;
        this.toastrService.error(err?.error?.msg || 'OTP verification failed');
      },
    });
  }

  resetPassword(modal: any) {
    if (!this.newPassword || this.newPassword.length < 8) {
      this.toastrService.error('Password must be at least 8 characters');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.toastrService.error('Passwords do not match');
      return;
    }
    this.isResetting = true;
    const payload = { email: this.userEmail, password: this.newPassword };
    this.authenticationService.setPassword(payload)
      .pipe(finalize(() => (this.isResetting = false)))
      .subscribe({
        next: (res: any) => {
          if (res && !res.err) {
            this.toastrService.success(res.msg || 'Password updated');
            modal.close();
          } else {
            this.toastrService.error(res?.msg || 'Failed to update password');
          }
        },
        error: (err: any) => {
          this.toastrService.error(err?.error?.msg || 'Failed to update password');
        },
      });
  }

  ngOnInit(): void {
    this.companylogo();
    const token = localStorage.getItem('token');
    const currentUser =  localStorage.getItem('currentUser');
    if (token || currentUser) {
      // REDIRECT TO DASHBOARD
      this.router.navigate(['/dashboard']);
    }
    
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
      password: new FormControl('', [Validators.required]),
      termsConditions: new FormControl(true, [Validators.requiredTrue])
    })
  }

  // onSubmit(): void {
  //   this.isLoginFormSubmitted = true;
  //   if (this.loginForm.invalid) {
  //     this.toastrService.error('Please fill out the form correctly.', 'Login Failed');
  //     return;
  //   }

  //   const userDetails = {
  //     email: this.loginForm.value.email,
  //     password: this.loginForm.value.password,
  //     user_type: 'publisher'
  //   };

  //   this.authenticationService.login(userDetails).subscribe({
  //     next: (data) => {
  //       console.log(" data ", data );
  //       if ((data as any)?.err) {
  //         this.toastrService.error('Invalid email or password!', 'Error!');
  //       } else {
  //         let preVisitedPath = sessionStorage.getItem("preVisitedPath") || "/dashboard";
  //         this.router.navigateByUrl(preVisitedPath);
  //       }
  //     },
  //     error: (error) => {
  //       this.toastrService.error('Invalid email or password!', 'Error!');
  //     },
  //   });
  // }

  onSubmit(): void {
    this.isLoginFormSubmitted = true;
    console.log(" 1 ")
    if (this.loginForm.invalid) {
      this.toastrService.error('Please fill out the form correctly.', 'Login Failed');
      return;
    }
    console.log(" 2 ")
    const payload = {
      userDetails: {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        // user_type: 'publisher'
      }
    };
    console.log(" 3 ")
    this.authenticationService.login(payload.userDetails).subscribe({
      next: (data: any) => {
        console.log("response:", data);

        if ((data as any )?.err) {
          this.toastrService.error('Invalid email or password!', 'Error!');
          return;
        }
        const preVisitedPath = sessionStorage.getItem('preVisitedPath') || '/dashboard';
        this.router.navigateByUrl(preVisitedPath);
      },
      error: () => {
        this.toastrService.error('Invalid email or password!', 'Error!');
      }
    });
  }

  companylogo() {
    if (this.domain.includes('cost2action')) { // localhost
      this.logo = 'cost2action.png'
    }
    if (this.domain.includes('crossway')) {
      this.logo = 'crossway.jpg'
    }
    if (this.domain.includes('andromobi')) {
      this.logo = 'andromobi.png'
    }
    if (this.domain.includes('offerrobo')) {
      this.logo = 'offerrobo.png'
    }
    if (this.domain.includes('adsever')) {
      this.logo = 'adsever.png'
    }
    if (this.domain.includes('adsdolfin')) {
      this.logo = 'icon2.png'
    }
    if (this.domain.includes('grootmobi')) {
      this.logo = 'grootmobi.png'
    }
    if (this.domain.includes('pantherads')) {
      this.logo = 'pantherads.png'
    }
    if(this.domain.includes("leadworld")){
      this.logo = 'leadworld.jpg'
    }
  }

}
