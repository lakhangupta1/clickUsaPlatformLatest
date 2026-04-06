import { Component, OnInit } from '@angular/core';
import { IModal, ModalType, Size } from 'src/app/shared/model/model/model.component';
import { Globalconstant } from 'src/app/const/global'
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { OffersService } from 'src/app/services/offers.service';
import { ToastrService } from 'ngx-toastr';
const config = Globalconstant.config;

@Component({
  selector: 'app-offers-details',
  standalone: true,
  imports: [CommonModule,NgbPopoverModule,NgbModule],
  templateUrl: './offers-details.component.html',
  styleUrl: './offers-details.component.scss'
})
export class OffersDetailsComponent implements OnInit {

  isCopied = false;
  offerid: any;
  offerData: any = null;
  publisherDetail: any = [];

  defaultPublisherOfferStatus: any = config.PUBLISHER_OFFERS_STATUS;
  pubOffStList: any = [];
  modal: IModal;
  offerBlockedStatus: boolean = false;
  extra_params: string = "";
  linkSettings: any = {};
  selectedPublisherId: string = "";
  publisher_payout = 0;
  publisherOffer = [];
  publisher_list: any = [];
  publisherMultiConfig: {};
  pubStatusEdit: boolean = false;
  showGeneratedLink: boolean = false;
  pubOffStatus: any = null;
  publisherPay: string = 'defaultPay';
  publisherLink: string = '';
  pubOffSt: any = '';
  showOsVersionDiv: boolean = false;
  copied = false;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal, private offer_service: OffersService, private toasterService: ToastrService) { }

  ngOnInit(): void {
    this.offerid = this.activatedRoute.snapshot.paramMap.get('id');
    this.getOfferData(this.offerid)
  }
  getOfferData(offerId) {
    this.offer_service.getOneOfferDetails(offerId).subscribe((apiResult) => {
      if (!apiResult['err']) {
        this.offerData = apiResult['payload'];
        if (this.offerData.tracking_link) {
          this.offer_service.showPlatform(this.offerData.advertiser_platform_id).subscribe(result => {
            if (!result['err'] && result['payload'] && result['payload'][0] && result['payload'][0]['parameters']) {
              this.offerData.tracking_link = this.offerData.tracking_link + "&" + result['payload'][0]['parameters'];
            }
          });
        }
        if (this.offerData.isBlacklist == 1) {
          this.offerBlockedStatus = true;
          this.toasterService.warning("This offer is blocked!!", 'Warning!');
        }
        if (!this.offerData.thumbnail && this.offerData.device_targeting.os.length) {
          if (this.offerData.device_targeting.os[0].toLowerCase() == 'ios') {
            this.offerData.thumbnail = "../../../../../../assets/images/icon/ios.svg"
          }
          else if (this.offerData.device_targeting.os[0].toLowerCase() == 'android') {
            this.offerData.thumbnail = "../../../../../../assets/images/icon/android.svg"
          }
        }
      }
    })
  }
  applyOfferByPublisher(offerId) {

    this.modal.title = "Apply Offer";
    this.modal.body = "Confirm if you want to apply this offer.";
    this.modal.style.size = Size.sm;
    this.modal.type = ModalType.Confirm;
    const modalRef = this.modalService.open(this.modal.style);
    modalRef.componentInstance.modal = this.modal;

    modalRef.result.then((userResponse) => {
      if (userResponse == 'true') {
        this.offer_service.publisherApplyOffersRequest({ offerIds: [offerId] }).subscribe((result) => {
          if (result['err']) {
            this.toasterService.error(result['msg'], 'Error!');
          } else {
            this.toasterService.success(result['msg'], 'Success!');
            this.getOfferData(this.offerid);
          }
        });
      }
    });
  }
  getStatusLabel(currStatus) {
    let StatusLabel = null
    for (let key in this.defaultPublisherOfferStatus) {
      if (this.defaultPublisherOfferStatus[key]['value'] == currStatus) {
        StatusLabel = this.defaultPublisherOfferStatus[key]['label'];
        break;
      }
    }
    return StatusLabel;
  }

  showOsVersion() {
    this.showOsVersionDiv = !this.showOsVersionDiv;
  }

  htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }
  // copyLink(linkInputElement: HTMLInputElement) {
  //   linkInputElement.select();
  //   document.execCommand("copy");
  //   linkInputElement.setSelectionRange(0, 0);
  //   this.copied = true;
  //   setTimeout(() => {
  //     this.copied = false;
  //   }, 1000);
  // }
  copyLink(linkInputElemment) {
    linkInputElemment.select();
    document.execCommand("copy");
    linkInputElemment.setSelectionRange(0, 0);
  }
}
