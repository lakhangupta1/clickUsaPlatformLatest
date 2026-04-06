import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NetworkService } from 'src/app/services/network.service';
import { PublisherService } from 'src/app/services/publisher.service';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { PublisherData, PublisherFinanceDetails } from 'src/app/shared/model/profile.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Country } from 'country-state-city';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  publisherDataload = false;

  userData: any;
  appDomain: any;
  company_name: any;
  company_logo: any;
  publisherData!: PublisherData;
  editFinance: PublisherFinanceDetails = {};
  editPublisher: PublisherData = {
    pid: 0,
    name: '',
    company: '',
    email: '',
    phone: '',
    status: '',
    address: {},
    fD: {}
  };
  constructor(
    private authService: AuthenticationService,
    private networkService: NetworkService,
    private publisherService: PublisherService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.appDomain = this.networkService.domain;
    this.userData = this.authService.getUserDetails;
    // console.log("userData", this.userData['userDetail']);
    this.getPublisherAccManagerDetails(this.userData.userDetail.parentId[0]);

  }

  openEditModal(content: any) {
    (document.activeElement as HTMLElement)?.blur();

    this.editPublisher = {
      ...this.publisherData,
      address: { ...this.publisherData.address }
    };
    this.modalService.open(content, { size: 'lg' });
  }

  cancelEdit(modal: any) {
    this.toastr.info("Edit cancelled");
    modal.dismiss();
  }

  openFinanceEditModal(content: any) {

    (document.activeElement as HTMLElement)?.blur();

    this.editFinance = {
      ...this.publisherData.fD
    };
    // console.log("editFinance-- ", this.editFinance);
    this.modalService.open(content, { size: 'lg' });
  }
  getPublisherAccManagerDetails(parentId) {
    if (parentId) {
      this.publisherService.getPublisher(parentId).subscribe(result => {
        if (!result['err']) {
          this.publisherData = result['payload'];
          // console.log("publisherData --", this.publisherData);
        }
      })
    }
    this.publisherDataload = true;

  }

  updatePublisher(modal: any) {

    const id = (this.editPublisher as any)._id;

    const data = {
      pd: {
        name: this.editPublisher.name,
        phone: this.editPublisher.phone,
        company: this.editPublisher.company,
        skype_id: this.editPublisher.skype_id,
        address: this.editPublisher.address?.address,
        city: this.editPublisher.address?.city,
        locality: this.editPublisher.address?.locality,
        pincode: this.editPublisher.address?.pincode,
        state: this.editPublisher.address?.state,
        country: this.editPublisher.address?.country
      }
    };

    // console.log("Form Data :", data);

    this.publisherService.updatePublisher(id, data).subscribe({

      next: (res: any) => {

        if (!res.err) {

          this.publisherData = { ...this.editPublisher };

          this.toastr.success(res.msg, "Success");

          modal.close();
          setTimeout(() => {
            window.location.reload();
            // this.publisherData = { ...this.editPublisher };
          }, 1000);
        }

      }, error: (err) => {

        console.error(err);
        this.toastr.error("Update failed");

      }
    });

  }

  updateFinance(modal: any) {

    const id = (this.publisherData as any)._id;

    const data = {
      fD: {
        aN: this.editFinance.aN,
        aNumber: this.editFinance.aNumber,
        bN: this.editFinance.bN,
        ifcs: this.editFinance.ifcs,
        ppId: this.editFinance.ppId,
        payoneerId: this.editFinance.payoneerId,
        aType: this.editFinance.aType,
        wc: this.editFinance.wc,
        rT: this.editFinance.rT,
        addr: this.editFinance.addr
      }
    };

    // console.log("Finance Data:", data);

    this.publisherService.updatePublisher(id, data).subscribe({

      next: (res: any) => {

        if (!res.err) {

          this.publisherData.fD = { ...this.editFinance };

          this.toastr.success(res.msg, "Success");

          modal.close();

          setTimeout(() => {
            window.location.reload();
            // this.publisherData.fD = { ...this.editFinance };

          }, 1000);
        }

      },

      error: (err) => {

        console.error(err);
        this.toastr.error("Finance update failed");

      }

    });

  }
}

