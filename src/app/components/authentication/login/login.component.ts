import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FeatherModule } from 'angular-feather';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, FeatherModule, RouterModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
  showPassword: boolean = false;
  logo: string = 'user1.jpg';
  isLoginFormSubmitted: boolean = true;
  loginForm!: FormGroup;
  domain: string = '';

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/'])
    }
    this.domain = window.location.hostname;

  }

  ngOnInit(): void {
    this.companylogo();
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/)
      ]),
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

    if (this.loginForm.invalid) {
      this.toastrService.error('Please fill out the form correctly.', 'Login Failed');
      return;
    }

    const payload = {
      userDetails: {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        // user_type: 'publisher'
      }
    };

    this.authenticationService.login(payload.userDetails).subscribe({
      next: (data: any) => {
        console.log("response:", data);

        if ((data as any )?.err) {
          this.toastrService.error('Invalid email or password!', 'Error!');
          // return;
        }

        //  Save token (IMPORTANT)
        // const token = data?.payload?.[0]?.token;
        // const refreshToken = data?.payload?.[0]?.refreshtoken;

        // if (token) {
        //   localStorage.setItem('token', token);
        //   localStorage.setItem('refreshToken', refreshToken);
        //   localStorage.setItem("user", JSON.stringify([{ refreshToken, token }]))
        // }
        let preVisitedPath =  "/dashboard"; // sessionStorage.getItem("preVisitedPath") ||
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
