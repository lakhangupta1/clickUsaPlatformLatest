import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, switchMap } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PostbackService } from 'src/app/services/postback.service';
import { Macro } from 'src/app/const/constants';


@Component({
  selector: 'app-postback-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './postback-add.component.html',
  styleUrl: './postback-add.component.scss'
})
export class PostbackAddComponent implements OnInit {
  postbackForm: FormGroup;
  macroList = [];
  selectedParams = [];
  customselectedParams = [];
  submitted: boolean = false;
  pid: any;
  postbackId: any;
  holdPostbackId: boolean = false;
  htmlForParameters: boolean = false;
  htmlForCustomParameters: boolean = false;
  constructor(
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public changerouter: Router,
    private PostbackService: PostbackService,
    private authService: AuthenticationService
  ) {
    this.pid = this.route.snapshot.paramMap.get('id');
    if (!this.pid) this.pid = this.authService.getUserDetails.userDetail.pid;
    this.postbackId = this.route.snapshot.paramMap.get('postback_id');
  }
  
  get f() { return this.postbackForm.controls; }

  ngOnInit(): void {
    this.macroList = Object.keys(Macro);
    this.postbackForm = this.formBuilder.group({
      postbackUrl: ['', [Validators.required]],
      parameter: this.formBuilder.array([]),
      customParameter: this.formBuilder.array([]),
    });
    if (this.postbackId) {
      this.resetFormData();
      this.PostbackService.showPostback(this.postbackId).pipe(
        switchMap(result => {
          if (!result || result['err']) {
            return this.PostbackService.getHoldPostback(this.postbackId);
          }
          return of(result);
        })
      ).subscribe(
        (finalResult) => {
          if (finalResult['payload'] && finalResult['payload'].length) {
            this.htmlForParameters = true;
            this.htmlForCustomParameters = true;
            const postbackUrl = `${finalResult['payload'][0]['endpoint']}?${finalResult['payload'][0]['parm']}`;
            this.postbackForm.controls['postbackUrl'].setValue(postbackUrl);
            this.parseAndFillParameters(postbackUrl);
          } else {
            this.toastrService.error("Postback not found!");
          }
        },
        (error) => {
          this.toastrService.error(error['msg']);
        }
      );
    }
  }

  selectedParameters(index, event) {
    const value = event.target.value; 
  
    if (this.selectedParams.includes(value)) {
      (<FormArray>this.postbackForm.get('parameter')).removeAt(index);
      this.selectedParams.splice(index, 1);
    } else {
      this.selectedParams[index] = value ? value.trim() : ''; 
    }
    this.formatePostbackUrl();
  }
  

  selectedCustomParameters(index, value) {
    if (this.customselectedParams.includes(value)) {
      (<FormArray>this.postbackForm.get('customParameter')).removeAt(index);
      this.customselectedParams.splice(index, 1);
    } else {
      this.customselectedParams[index] = value.trim();
    }
    this.formatePostbackUrl();
  }


  addOtherSkillFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      value: ['', Validators.required],
    });
  }

  addButtonClick() {
    if (this.postbackForm && this.postbackForm.controls['postbackUrl'].value) {
      if (this.validateEnterdPostbackUrl(this.postbackForm.controls['postbackUrl'].value)) {
        this.htmlForParameters = true;
        (this.postbackForm.get('parameter') as FormArray).push(this.addOtherSkillFormGroup());
      }
      else {
        this.toastrService.info("Enter valid postback URL", 'Error!');
      }
    }
    else {
      this.toastrService.info("Postback URL can't be blank", 'Error!');
    }
  }
  addCustomButtonClick() {
    if (this.postbackForm.controls['postbackUrl'].value) {
      if (this.validateEnterdPostbackUrl(this.postbackForm.controls['postbackUrl'].value)) {
        this.htmlForCustomParameters = true;
        (<FormArray>this.postbackForm.get('customParameter')).push(this.addOtherSkillFormGroup());
      }
      else {
        this.toastrService.info("Enter valid postback url", 'Error!');
      }
    }
    else {
      this.toastrService.info("Postback url can't be blank", 'Error!');
    }
  }
  deleteButtonClick(i) {
    this.selectedParams.splice(i, 1);
    (<FormArray>this.postbackForm.get('parameter')).removeAt(i);
    this.formatePostbackUrl();
    if (this.selectedParams.length == 0) {
      this.htmlForParameters = false;
    }
  }
  deleteCustomButtonClick(i) {
    this.customselectedParams.splice(i, 1);
    (<FormArray>this.postbackForm.get('customParameter')).removeAt(i);
    this.formatePostbackUrl();

  }
 
  onSubmit() {
    this.submitted = true;

    if (this.postbackForm.value.postbackUrl) {
      let isValidPostbackUrl = this.validateEnterdPostbackUrl(this.postbackForm.value.postbackUrl);
      if (!isValidPostbackUrl) {
        this.toastrService.info("Not a valid postback url", 'Error!');
        return;
      }
    }
    else {
      this.toastrService.info("Postback url can't be blank", 'Error!');
      return;
    }

    if (!this.htmlForCustomParameters || !this.htmlForParameters) {
      this.toastrService.info("Add atleast one parameters or custom parameters", 'Error!');
      return;
    }

    if (this.postbackForm.invalid) {
      this.toastrService.info("Recheck your form data, Something missing", 'Error!');
      return;
    }

    let Parameters = JSON.stringify(this.postbackForm.value.parameter);
    let custom_param = JSON.stringify(this.postbackForm.value.customParameter);

    let data = {
      publisher_id: this.pid,
      postbackurl: this.postbackForm.value.postbackUrl,
      parameter: Parameters,
      customParameter: custom_param
    };
    if (this.postbackForm.value.postbackUrl.includes('?')) {
      data = {
        publisher_id: this.pid,
        postbackurl: this.postbackForm.value.postbackUrl.split('?')[0],
        parameter: Parameters,
        customParameter: custom_param
      };
    }

    let apiUrl: Observable<Object>;
    if (this.holdPostbackId) apiUrl = this.PostbackService.updateHoldPostback(this.postbackId, data);
    else apiUrl = this.PostbackService.saveHoldPostback(data);

    apiUrl.subscribe(
      (data) => {
        this.submitted = false;
        if (data['err']) this.toastrService.info(data['msg'])
        else this.changerouter.navigate(['/postback/list']);
      },
      (error) => this.toastrService.error(error.msg, 'Error!')
    )
  }

  validateEnterdPostbackUrl(url) {
    if ((url.includes('http://') || url.includes('https://')) && url.includes('?') && url.split('?').length == 2) {
      return true;
    }
    return false;
  }

  resetFormData() {
    (<FormArray>this.postbackForm.get('parameter')).clear();
    (<FormArray>this.postbackForm.get('customParameter')).clear();
  }

  onChangePostbackUrl(event) {
    this.htmlForParameters = false;
    this.htmlForCustomParameters = false;
    if (this.validateEnterdPostbackUrl(event.target.value)) {
      if (event.target.value.includes('?')) {
        this.htmlForParameters = true;
        this.htmlForCustomParameters = true;
        this.resetFormData();
        this.parseAndFillParameters(event.target.value);
      }
    }
  }

  parseAndFillParameters(PostbackUrl) {

    let isValidPostbackUrl = this.validateEnterdPostbackUrl(PostbackUrl);
    if (isValidPostbackUrl) {
      let parameterUrl = new URL(PostbackUrl);
      let queryString = parameterUrl.search;
      let queryStringArray = [];
      if (queryString) {
        queryStringArray = queryString.split('?')[1].split('&');
        for (let macrosKey of queryStringArray) {
          let formatDict = this.validateAndParseMacros(macrosKey);
          if (formatDict.isValid) {
            if (formatDict.type == 'parameter') {
              const attr_data = this.formBuilder.group(formatDict.data);
              (<FormArray>this.postbackForm.get('parameter')).push(attr_data);
            }
            else if (formatDict.type == 'customParameter') {
              const attr_data = this.formBuilder.group(formatDict.data);
              (<FormArray>this.postbackForm.get('customParameter')).push(attr_data);
            }
          }
        }
      }
    }
    else {
      this.toastrService.info("Enter Proper Postback URL", 'Error!');
    }
  }

  formatePostbackUrl() {
    let postbackUrl = this.postbackForm.controls['postbackUrl'].value;

    if (postbackUrl.includes('?')) {
      postbackUrl = postbackUrl.split('?')[0] + "?";
    }
    else {
      postbackUrl += '?';
    }
    this.postbackForm.value.parameter.forEach(element => {
      postbackUrl += element['name'] + "={" + element['value'] + "}&"
    });
    this.postbackForm.value.customParameter.forEach(element => {
      postbackUrl += element['name'] + "=" + element['value'] + "&"
    });

    this.postbackForm.controls['postbackUrl'].setValue(postbackUrl.slice(0, -1));
  }

  validateAndParseMacros(macroKey) {
    let formatDict = { "isValid": false, "data": {}, "type": "" };
    if (macroKey.includes("={") && macroKey.includes("}")) {
      let data = macroKey.split("={");
      if (data.length == 2) {
        let dataValue = data[1].replace('}', '');
        this.selectedParams.push(dataValue);
        formatDict["isValid"] = true;
        formatDict["type"] = "parameter";
        formatDict["data"] = { name: data[0], value: dataValue };
      }
    }
    else if (macroKey.includes("=")) {
      let data = macroKey.split("=");
      if (data.length == 2) {
        this.customselectedParams.push(data[1]);
        formatDict["isValid"] = true;
        formatDict["type"] = "customParameter";
        formatDict["data"] = { name: data[0], value: data[1] };
      }
    }

    return formatDict;
  }
}

