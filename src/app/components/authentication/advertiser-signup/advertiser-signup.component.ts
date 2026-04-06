import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Globalconstant } from 'src/app/const/global';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-advertiser-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './advertiser-signup.component.html',
  styleUrls: ['./advertiser-signup.component.scss']
})
export class AdvertiserSignupComponent implements OnInit {

  signupForm!: FormGroup;
  submitted = false;
  showPassword = false;

  countryList: any[] = [];
  domain: string = '';
  logo: string = 'user1.jpg';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toaster: ToastrService
  ) {
    this.countryList = Globalconstant.config.country;
    this.domain = window.location.hostname;
    // console.log("domain",this.domain)
  }

  ngOnInit(): void {
this.companylogo();
    // console.log("signupForm -1", this.signupForm)

    this.signupForm = this.fb.group({
      company: ['', Validators.required],
      name: ['', [Validators.required, Validators.pattern("^[a-zA-Z ]+$")]],
      phone: ['', [Validators.required, Validators.pattern("^[6-9][0-9]{9}$")]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', [Validators.required, Validators.pattern("^[a-zA-Z. ]+$")]],
      country: ['', Validators.required],
      skype_id: ['', Validators.required],
      top_vertical: ['', Validators.required],
      model: ['', Validators.required],
      account_manager: []
    });

  }

  get f() {
    return this.signupForm.controls;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {

    this.submitted = true;
    // console.log("signupForm -2", this.signupForm.value)
    if (this.signupForm.invalid) {
      return;
    }

    const userDetails = this.signupForm.value;
    let token = window.location.hostname;

    this.authenticationService.Adv_Register(userDetails, token).subscribe((data: any) => {

      if (data.err) {
        this.toaster.error(data.msg);
        // console.log("data", data);
      } else {
        this.toaster.success(data.msg);
        this.signupForm.reset();
        this.submitted = false;
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