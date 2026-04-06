import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ExternalService } from 'src/app/services/external.service';
import { Country, State, City } from 'country-state-city';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {

  @ViewChild('country', { static: false }) country!: ElementRef;
  @ViewChild('state', { static: false }) state!: ElementRef;
  @ViewChild('city', { static: false }) city!: ElementRef;

  countries = Country.getAllCountries();
  states = [];
  cities = [];
  logo: string = 'user1.jpg';
  selectedCountry: any = null;
  selectedState: any = null;
  selectedCity: any = null;

  publisherformdata: string = '';
  publisherRegisterForm: FormGroup;
  domain: string = '';
  user_type: string = 'publisher';

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private externalService: ExternalService,
    private formBuilder: FormBuilder,
    private toasterService: ToastrService,
    private authenticationService: AuthenticationService
  ) {
    this.domain = window.location.hostname;
    // console.log('Domain:', this.domain);
  }

  ngOnInit(): void {
    this.companylogo();

    this.publisherRegisterForm = this.formBuilder.group({
      company: ['', [
        Validators.required,
      ]],

      name: ['', [
        Validators.required,
      ]],

      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(254)
      ]],

      phone: ['', [
        Validators.required,
        Validators.pattern("^[6-9][0-9]{9}$")
      ]],

      address: ['', Validators.required],
      locality: ['',],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],

      pincode: ['', [
        Validators.required
      ]],

      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],

      skypeId: ['', Validators.required],

      website: ['', [
        Validators.required
      ]],

      // terms: [false, Validators.requiredTrue]
    });
  }
  get f() {
    return this.publisherRegisterForm.controls;
  }

  isInvalid(controlName: string): boolean {
    const control = this.publisherRegisterForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  onSubmit() {
    if (this.publisherRegisterForm.invalid) {
      this.publisherRegisterForm.markAllAsTouched();
      this.toasterService.error("Please fill in all required fields correctly.");
      return;
    }
    const formData = this.publisherRegisterForm.value;
    // console.log("form data",formData);
    const submitData = {
      ...formData,
      // domain: this.domain,
      // user_type: this.user_type
    };

    this.publisherformdata = JSON.stringify(submitData, null, 2);

    this.authenticationService.signup(submitData).subscribe({


      next: (response) => {
        // console.log('Signup successful', response);
        // this.toasterService.success('Signup successful! Waiting for approval.');
        this.toasterService.success('Sussecc', response['msg']);
        // this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error occurred during signup', error);
        this.toasterService.error("Error", error['msg']);
      }
    });
  }
  onCountryChange($event): void {
    const countryData = JSON.parse(this.country.nativeElement.value);
    this.states = State.getStatesOfCountry(countryData.isoCode) || [];
    this.selectedCountry = countryData;

    this.selectedState = null;
    this.selectedCity = null;
    this.cities = [];
  }

  onStateChange($event): void {
    const stateData = JSON.parse(this.state.nativeElement.value);
    this.cities = City.getCitiesOfState(this.selectedCountry.isoCode, stateData.isoCode) || [];
    this.selectedState = stateData;

    this.selectedCity = null;
  }

  onCityChange($event): void {
    this.selectedCity = JSON.parse(this.city.nativeElement.value);
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
