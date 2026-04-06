import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { config } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ExternalService } from 'src/app/services/external.service';

@Component({
  selector: 'app-publisher',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './publisher.component.html',
  styleUrl: './publisher.component.scss'
})
export class PublisherComponent implements OnInit {
  logo = "assets/images/logo-icon.png";
  token: String = "";
  company_logo: File = null;
  filename: string = "";
  submitted: boolean = false;
  countryList = [];

  publisherRegisterForm: FormGroup = null;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private externalservice: ExternalService
  ) {
    this.token = this.route.snapshot.paramMap.get('token')
    // this.countryList = config.country;

  }

  ngOnInit(): void {
    if (this.token) {
      this.externalservice.validateToken(this.token).subscribe(apiResponse => {
        if (apiResponse['err']) {
          this.router.navigate(['/404'])
        }
        else {
          this.publisherRegisterForm = this.formBuilder.group({
            company: new FormControl("", [Validators.required, Validators.pattern("^[0-9a-zA-Z. ]*$")]),
            name: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+$")]),
            email: new FormControl("", [Validators.required, Validators.email, Validators.email]),
            password: new FormControl("", [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)]),
            phone: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+$")]),
            skypeId: new FormControl("", [Validators.required]),
            website: new FormControl(""),
            address: new FormControl(""),
            locality: new FormControl(""),
            city: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z ]+$")]),
            pincode: new FormControl("", [Validators.pattern("^[0-9]+$"), Validators.minLength(0), Validators.maxLength(6)]),
            state: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z ]+$")]),
            country: new FormControl("", [Validators.required]),
            terms: new FormControl("", [Validators.requiredTrue]),
          })
        }
      })
    }
    else {
      this.router.navigate(['/404'])
    }

  }
  // get pubRegFormControls() { return this.publisherRegisterForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.publisherRegisterForm.invalid) {
      this.toastrService.info("Fill Data in required field!", "Required Field")
      return;
    }
    if (!this.publisherRegisterForm.controls['terms'].value) {
      this.toastrService.info("Pls accept select terms and conditions.")
      return;
    }
    this.externalservice.saveExternalPublisher(this.publisherRegisterForm.value, this.token).subscribe(
      (apiResponse) => {
        if (!apiResponse) this.toastrService.error("Not Found");
        else if (apiResponse['err']) this.toastrService.error(apiResponse['msg']);
        else {
          this.submitted = false;
          this.toastrService.success(apiResponse['msg'], "Error!");
        }
      },
      (error) => {
        this.toastrService.error(error['msg'])
      }
    )
  }

}
