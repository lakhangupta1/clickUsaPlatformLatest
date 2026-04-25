import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { PublisherFinanceDetails, UserData } from 'src/app/shared/model/profile.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PublisherService } from 'src/app/services/publisher.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  publisherDataload = false;
  UserData!: UserData;
  publisherData!: UserData;
  appDomain: string = '';

  editFinance: PublisherFinanceDetails = {};

  editPublisher: UserData = {
    id: '',
    first_name: '',
    last_name: '',
    company: '',
    email: '',
    phone: '',
    status: '',
    country: '',
    currency: '',
    pincode: '',
    state: '',
    address : '',

    pay_type : '',
    is_primary : false,
    account_holder_name: '',
    account_number: 0,
    ifsc_code: '',
    bank_name: '',
    is_verified: false,

    upi : '',
    paypal: '',
    paytm: '',
  };

  constructor(
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private publisherService : PublisherService
  ) {}

  ngOnInit(): void {

    const user = this.authService.getUserDetails;
    console.log("Full User Data:", user);
    // handle both structures
    this.UserData = user?.userDetail || user;
    // this.UserData['phone'] = '8081796708'
    // assign for edit
    this.publisherData = this.UserData;
    this.publisherDataload = true;
    this.publisherService.getPublisher(this.publisherData?.id ).subscribe({
      next : ( result : any ) => {
        this.publisherData = result['payload'];
        console.log(' 8081796708 -> ',result['payload'])
        this.UserData['phone'] = result?.['payload']?.['profile']['phone'];
        this.UserData['company'] = result?.['payload']?.['company'];
        this.UserData['state'] = result?.['payload']?.['profile']['state'];
        this.UserData['address'] = result?.['payload']?.['profile']['address'];
        this.UserData['pincode'] = result?.['payload']?.['profile']['pincode'];
        this.UserData['account_holder_name'] = result?.['payload']?.['profile']?.['bank']?.['account_holder_name'] || '';
        this.UserData['account_number'] = result?.['payload']?.['profile']?.['bank']?.['account_number'] || '';
        this.UserData['ifsc_code'] = result?.['payload']?.['profile']?.['bank']?.['ifsc_code'] || '';
        this.UserData['bank_name'] = result?.['payload']?.['profile']?.['bank']?.['bank_name'] || '';
        this.UserData['currency'] = result?.['payload']?.['profile']?.['currency'] || '';
        this.UserData['upi'] = result?.['payload']?.['profile']?.['upi'] || '';
        this.UserData['paypal'] = result?.['payload']?.['profile']?.['paypal'] || '';
        this.UserData['paytm'] = result?.['payload']?.['profile']?.['paytm'] || '';
        this.UserData['pay_type'] = result?.['payload']?.['profile']?.['pay_type'] || '';
        // currency
        this.publisherData['id'] = result['payload']['_id'];
        delete this.publisherData['_id']
      },
      error : (error : any ) => {

      }
    })
    this.appDomain = 'YOUR_API_URL'; // set properly
  }

  openEditModal(content: any) {
    console.log(" publisherData -> ", this.publisherData );
    if (!this.publisherData) return; 
    (document.activeElement as HTMLElement)?.blur();
    // clone object (important)
    this.editPublisher = { ...this.publisherData, ...this.UserData };
    this.modalService.open(content, { size: 'lg' });
  }

  cancelEdit(modal: any) {
    this.toastr.info("Edit cancelled");
    modal.dismiss();
  }

  updatePublisher(modal: any) {
    if (!this.editPublisher?.id) {
      this.toastr.error("Invalid user");
      return;
    }
    console.log(" editPublisher 1 -> ", this.editPublisher );
    const data = {
      pd: {
        id : this.editPublisher?.id,
        first_name: this.editPublisher?.first_name,
        company: this.editPublisher?.company,
        phone: this.editPublisher?.phone,
        pincode: this.editPublisher?.pincode,
        state: this.editPublisher?.state,
        country: this.editPublisher?.country,
        account_holder_name : this.editPublisher?.account_holder_name,
        account_number : this.editPublisher?.account_number,
        address : this.editPublisher?.address,
        bank_name : this.editPublisher?.bank_name,
        currency : this.editPublisher?.currency,
        // email : this.editPublisher?.email,
        ifsc_code : this.editPublisher?.ifsc_code,
        pay_type : this.editPublisher?.pay_type,
        paypal : this.editPublisher?.paypal,
        paytm : this.editPublisher?.paytm,
        upi : this.editPublisher?.upi
      }
    };

    console.log("Update Payload:", data);

    //  CALL API HERE
    // this.publisherService.updateUser(this.editPublisher._id, data).subscribe(...)

    // simulate success
    this.UserData = { ...this.editPublisher };
    this.publisherData = { ...this.editPublisher };
    console.log(" userData 1 -> ", this.UserData );
    this.toastr.success("Profile updated successfully");
    this.publisherService.updateUserProfile(this.UserData?.['id'], this.UserData).subscribe({
      next : ( result : any ) => {
        console.log(" updated profile result -> ", result );
      },
      error : ( error : any ) => {
        console.log(" error when updat profile -> ", error );
      }
    })
    modal.close();
  }
}