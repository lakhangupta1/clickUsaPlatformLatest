import { Component, HostListener, OnInit, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbDate, NgbCalendar, NgbModule, NgbPaginationModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OffersService } from 'src/app/services/offers.service';
import { Globalconstant } from 'src/app/const/global'
import { Shorten2Pipe, Shorten3Pipe, Shorten4Pipe } from "../../../shared/shorten/shorten.pipe";
import { publisherOfferFields } from 'src/app/shared/model/offer-list.model'
import { NgxPermissionsModule } from "ngx-permissions";
import { DatetimeRangePickerComponent } from "src/app/shared/datetime-range-picker/datetime-range-picker.component";

@Component({
  selector: 'app-all-offers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbPaginationModule, FormsModule, RouterModule, Shorten4Pipe, NgbPopoverModule, NgbModule, Shorten3Pipe, Shorten2Pipe, NgxPermissionsModule, DatetimeRangePickerComponent],
  templateUrl: './offers-list.component.html',
  styleUrl: './offers-list.component.scss'
})
export class OfferslistComponent implements OnInit {

  showOptions = false;
  offerVisibleType = "all";
  offerId = '';
  offerName = '';
  appId = '';
  os = '';
  country = '';
  status = '';
  limit = 100;
  page = 1;
  pageSize = 100;
  jumpPage = 1;
  offersData = [];
  selectedColumns = [];
  totalOffers = 0;
  newOffersCount = 0;
  innerWidth: number;
  sortOrder = true;
  modal: any;
  isWorkingOffer: boolean = false;
  jump_limit: number = 0;
  isAllSelected: boolean = false;

  showCheckbox = false;

  columnsList = publisherOfferFields.map(x => Object.assign({}, x));
  osList = Globalconstant.config.OS;
  deviceList = Globalconstant.config.DEVICE;
  countryList = Globalconstant.config.country;
  statusList = Globalconstant.config.PUBLISHER_Offer_STATUS;
  isIndeterminate: boolean = false;
  offercount: any;
  offerCount: number;

  selectedApplyOffers: any = [];
  publisherOfferFields: any;

  // date time range 
  dateRangeOption: string = '1';
  rangeOption = '1';
  dateRange: any = { startDateTime: new Date(new Date().setHours(0, 0, 0, 0)), endDateTime: new Date() };

  constructor(private calendar: NgbCalendar,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private toasterService: ToastrService,
    private modalService: NgbModal,
    private offerService: OffersService
  ) {
    this.onResize();
  }
  ngOnInit() {
    this.showCheckbox = this.router.url.includes('/offers/all');
    // console.log(this.isIndeterminate)
    // console.log("status list", this.statusList);
    if (this.router.url.includes('/offers/active')) {
      this.offerVisibleType = 'active';
    }
    if (this.router.url.includes('/offers/public')) {
      this.offerVisibleType = 'public';
    }
    if (this.router.url.includes('/offers/private')) {
      this.offerVisibleType = 'private';
    }

    // this.activatedRoute.queryParams.subscribe(params => {
    //   if (params['offer_id']) {
    //     this.offerId = params['offer_id'];
    //   }
    //   if (params['offer_name']) {
    //     this.offerName = params['offer_name'];
    //   }
    //   if (params['app_id']) {
    //     this.appId = params['app_id'];
    //   }
    //   if (params['os']) {
    //     this.os = params['os'];
    //   }
    //   if (params['country']) {
    //     this.country = params['country'];
    //   }
    //   if (params['status']) {
    //     this.status = params['status'];
    //   }
    //   if (params['page']) {
    //     this.page = +params['page'];
    //   }
    //   if (params['limit']) {
    //     this.limit = +params['limit'];
    //   }
    // });

    this.activatedRoute.queryParams.subscribe(params => {
      this.offerId = params['offer_id'] || '';
      this.offerName = params['offer_name'] || '';
      this.appId = params['app_id'] || '';
      this.os = params['os'] || '';
      this.country = params['country'] || '';
      this.status = params['status'] || '';
      this.page = +params['page'] || 1;
      this.limit = +params['limit'] || 100;
      if (params['start_date']) {
        this.dateRange['startDateTime'] = new Date(params['start_date']);
      }
      if (params['end_date']) {
        this.dateRange['endDateTime'] = new Date(params['end_date']);
      }
      // console.log("stutas",this.status.valueOf);
    });
    this.onFilter();
  }


  onFilter() {
    this.selectedColumns = [];

    const filter: any = this.formatFilter();
    filter.offerVisibleType = this.offerVisibleType;
    filter.jump_limit = this.jump_limit;
    filter.page = this.page;
    filter.limit = this.limit;

    if (this.isWorkingOffer) {
      filter.isWorkingOffer = true;
    }

    // this.alloffercount(filter);

    this.offerService.getOffers(filter).subscribe({
      next: (res: any) => {
        this.offersData = res?.payload?.data || [];
        this.offerCount = res?.payload?.count || [];
        // console.log("all offer count", this.offerCount);
        // console.log("all offer ", this.offersData)
      },
      error: () => {
        this.toasterService.error('Something went wrong', 'Error!');
      }
    });
  }
  // onFilter() {
  //   this.jumpPage = this.page;
  //   // this.offersData = [];
  //   this.newOffersCount = 0;

  //   const filter: any = this.formatFilter();
  //   filter['offerVisibleType'] = this.offerVisibleType;

  //   if (JSON.stringify(filter) === JSON.stringify({})) {
  //     return;
  //   }

  //   filter['jump_limit'] = this.jump_limit;

  //   if (this.isWorkingOffer === true) {
  //     this.toasterService.info('Select Your Hop');
  //     filter['isWorkingOffer'] = this.isWorkingOffer;
  //   }

  //   // this.offerService.getOffers(filter).subscribe(
  //   //   (data: any) => {
  //   //     console.log("all Offers", data.payload.data.length)
  //   //     if (data?.err) {
  //   //       this.toasterService.error(data.msg, 'Error!');
  //   //       return;
  //   //     }

  //   //     const rows = data?.payload?.data || [];

  //   //     if (rows.length) {
  //   //       this.offersData = rows;

  //   //       this.offersData.forEach((offer: any) => {
  //   //         offer.jumps = offer.jumps || 0;

  //   //         offer.isSelected = this.selectedApplyOffers.includes(offer._id);
  //   //       });

  //   //       this.isAllSelected =
  //   //         this.offersData.length > 0 &&
  //   //         this.offersData.every((o: any) => o.isSelected === true);
  //   //     } else {
  //   //       this.isAllSelected = false;
  //   //     }
  //   //   },
  //   //   err => {
  //   //     this.toasterService.error(
  //   //       'Something went wrong. Please try again.',
  //   //       'Error!'
  //   //     );
  //   //   }
  //   // );

  //   this.alloffercount(filter);

  //   // 🔥 Data API call
  //   this.offerService.getOffers(filter).subscribe(
  //     (data: any) => {
  //       const rows = data?.payload?.data || [];
  //       this.offersData = rows;
  //     }
  //   );
  // }

  formatFilter() {
    let filter = {};
    let navigateParam = {};
    this.selectedColumns = [];

    this.columnsList.map(obj => {
      if (obj['selected']) {
        this.selectedColumns.push(obj['db_name']);
      }
    });
    if (this.selectedColumns.length) {
      filter['column'] = this.selectedColumns;

    }

    if (this.offerId.trim()) {
      let offerIdArray = this.offerId.split(',');
      let filterOfferIdArray = [];
      for (let item of offerIdArray) {
        if (item.trim()) {
          filterOfferIdArray.push(item.trim());
        }
      }
      if (filterOfferIdArray.length) {
        if (filterOfferIdArray.length > 10) {
          this.toasterService.info('Maximum limit of offer ids is 10.', 'Info!');
          return {};
        }
        filter['offer_id'] = filterOfferIdArray;
        navigateParam['offer_id'] = filterOfferIdArray.toString();
      }
    }

    if (this.offerName.trim()) {
      filter['offer_name'] = navigateParam['offer_name'] = this.offerName.trim();
    }

    if (this.appId.trim()) {
      filter['app_id'] = navigateParam['app_id'] = this.appId.trim();
    }

    if (this.os.trim()) {
      filter['os'] = navigateParam['os'] = this.os.trim();
    }

    if (this.country.trim()) {
      filter['country'] = navigateParam['country'] = this.country.trim();
    }

    if (this.status.trim()) {
      filter['status'] = navigateParam['status'] = this.status.trim();
    }

    if (this.limit) {
      filter['limit'] = navigateParam['limit'] = this.limit;
    }

    if (this.page) {
      filter['page'] = this.page;
    }

    // date picker range
    if (this.dateRange?.startDateTime && this.dateRange?.endDateTime) {
      const start = new Date(this.dateRange.startDateTime);
      const end = new Date(this.dateRange.endDateTime);

      filter['start_date'] = start.toISOString();
      filter['end_date'] = end.toISOString();

      navigateParam['start_date'] = start.toISOString();
      navigateParam['end_date'] = end.toISOString();
    }

    this.navigateToLink(navigateParam);

    return filter;
  }

  navigateToLink(obj) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: obj,
      // skipLocationChange: false,
      replaceUrl: true
    });
  }

  // selectAll(event: Event) {
  //   const checked = (event.target as HTMLInputElement).checked;

  //   this.isAllSelected = checked;
  //   this.isIndeterminate = false;

  //   this.offersData.forEach((offer: any) => {
  //     offer.isSelected = checked;
  //   });

  //   if (checked) {
  //     this.selectedApplyOffers = this.offersData.map((o: any) => o._id);
  //   } else {
  //     this.selectedApplyOffers = [];
  //   }
  // }
  selectAll(event: Event) {

    const checked = (event.target as HTMLInputElement).checked;

    this.offersData.forEach((offer: any) => {
      offer.isSelected = checked;
    });

    if (checked) {
      this.selectedApplyOffers = this.offersData.map(o => o._id);
    } else {
      this.selectedApplyOffers = [];
    }

    this.updateSelectAllState();
  }



  sortTable() {
    this.sortOrder = !this.sortOrder;
    if (this.sortOrder) {
      this.offersData.sort((a, b) => parseInt(b.jumps) - parseInt(a.jumps));
      this.offersData.sort((a, b) => parseFloat(b.payout) - parseFloat(a.payout));
    } else {
      this.offersData.sort((a, b) => parseInt(a.jumps) - parseInt(b.jumps));
      this.offersData.sort((a, b) => parseFloat(a.payout) - parseFloat(b.payout));
    }
  }
  onReset() {
    // this.columnsList = this.publisherOfferFields.map(x => Object.assign({}, x));
    this.columnsList = publisherOfferFields.map(x => Object.assign({}, x));
    this.offerId = '';
    this.offerName = '';
    this.appId = '';
    this.os = '';
    this.country = '';
    this.status = '';
    this.limit = 100;
    this.page = 1;
    // this.offersData = [];
    this.totalOffers = 0;
    this.newOffersCount = 0;
  }

  getCountries(data) {
    let countries = '';
    for (let item of data) {
      countries += item['key'] + ', ';
    }
    return countries.slice(0, -2);
  }

  // saveSelectedApplyOffers(checked: any, offerId: string) {
  //   if (checked) {
  //     if (!this.selectedApplyOffers.includes(offerId)) this.selectedApplyOffers.push(offerId);
  //   } else {
  //     if (this.selectedApplyOffers.includes(offerId)) {
  //       this.selectedApplyOffers = this.selectedApplyOffers.filter((id: string) => id != offerId);
  //     }
  //   }

  //   this.isAllSelected =
  //     this.offersData.length > 0 &&
  //     this.offersData.every(o => o.isSelected === true);

  // }
  saveSelectedApplyOffers(offer: any) {

    if (offer.isSelected) {
      if (!this.selectedApplyOffers.includes(offer._id)) {
        this.selectedApplyOffers.push(offer._id);
      }
    } else {
      this.selectedApplyOffers =
        this.selectedApplyOffers.filter(id => id !== offer._id);
    }

    this.updateSelectAllState();
  }



  updateSelectAllState() {

    const total = this.offersData.length;
    const selected = this.offersData.filter(o => o.isSelected).length;

    if (selected === 0) {
      this.isAllSelected = false;
      this.isIndeterminate = false;
    }
    else if (selected === total) {
      this.isAllSelected = true;
      this.isIndeterminate = false;
    }
    else {
      this.isAllSelected = false;
      this.isIndeterminate = true;
    }
  }


  applySingleOffer(offerId: string) {
    if (offerId) {
      this.offerService.publisherApplyOffersRequest({ offerIds: [offerId] }).subscribe((result) => {
        if (result['err']) {
          this.toasterService.error(result['msg'], 'Error!');
        } else {
          for (let item of result['payload']) {
            let index = this.offersData.findIndex(x => x['_id'].toString() == item['offer_id'].toString());
            this.offersData[index]['status'] = item['status'];
          }
          this.toasterService.success(result['msg'], 'Success!');
        }
      });
    }
  }
  openBasicModal(content: any) {
    if (!this.selectedApplyOffers.length) {
      this.toasterService.info('Please select at least one offer.', 'Info!');
      return;
    }

    this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });
  }
  confirmApply(modal: any) {

    this.offerService.publisherApplyOffersRequest({ offerIds: this.selectedApplyOffers })
      .subscribe((result) => {

        if (result['err']) {
          this.toasterService.error(result['msg'], 'Error!');
        } else {

          for (let item of result['payload']) {
            let index = this.offersData.findIndex(
              x => x['_id'].toString() == item['offer_id'].toString()
            );
            this.offersData[index]['status'] = item['status'];
          }

          this.toasterService.success(result['msg'], 'Success!');
        }

        modal.close();
        // this.onFilter();
        // this.selectedApplyOffers = [];
        setTimeout(() => {
          window.location.reload();
        }, 1000);

      });

  }
  // openBasicModal() {
  //   if (this.selectedApplyOffers.length) {
  //     const userConfirmed = window.confirm('Confirm if you want to apply selected offers.');
  //     if (userConfirmed) {
  //       this.offerService.publisherApplyOffersRequest({ offerIds: this.selectedApplyOffers }).subscribe((result) => {
  //         if (result['err']) {
  //           this.toasterService.error(result['msg'], 'Error!');
  //         } else {
  //           for (let item of result['payload']) {
  //             let index = this.offersData.findIndex(x => x['_id'].toString() == item['offer_id'].toString());
  //             this.offersData[index]['status'] = item['status'];
  //           }
  //           this.toasterService.success(result['msg'], 'Success!');
  //         }
  //       });
  //     }
  //   } else {
  //     this.toasterService.info('Please select at least one offer.', 'Info!');
  //     return;
  //   }
  // }

  // openBasicModal() {
  //   if (this.selectedApplyOffers.length) {
  //     this.modal = {
  //       title: 'Apply Offer',
  //       body: 'Confirm if you want to apply selected offers.',
  //       style: { centered: true, size: Size.lg, scrollable: true },
  //       type: ModalType.Confirm,
  //       backdropClass: 'light-blue-backdrop',
  //       windowClass: 'dark-modal',
  //       hideCloseButton: true,
  //       closeOnOutsideClick: false,
  //       animation: true,
  //       keyboard: false
  //     };
  //     const modalRef = this.modalService.open(this.modal.style);
  //     modalRef.componentInstance.modal = this.modal;
  //     modalRef.result.then((userResponse) => {
  //       if (userResponse == 'true') {
  //         this.offerService.publisherApplyOffersRequest({ offerIds: this.selectedApplyOffers }).subscribe((result) => {
  //           if (result['err']) {
  //             this.toasterService.error(result['msg'], 'Error!');
  //           } else {
  //             for (let item of result['payload']) {
  //               let index = this.offersData.findIndex(x => x['_id'].toString() == item['offer_id'].toString());
  //               this.offersData[index]['status'] = item['status'];
  //             }
  //             this.toasterService.success(result['msg'], 'Success!');
  //           }
  //         });
  //       }
  //     });
  //   }
  //   else {
  //     this.toasterService.info('Please select at least one offer.', 'Info!');
  //     return;
  //   }
  // }

  @HostListener('window:scroll', [])
  onResize() {
    this.innerWidth = window.innerWidth;
  }

  getPage(page) {
    this.page = page;
    this.onFilter();
    // console.log('Page changed to:', page);
  }

  getOSIcon(os: string[]): string {

    if (!os || os.length === 0) {
      return 'unknown.svg';
    }

    if (os.includes('android') && os.includes('ios') && os.includes('windows') && os.includes('blackberry')) {
      return 'all.png';
    }
    if (os.includes('all')) {
      return 'all.png';
    }

    if (os.includes('android') && os.includes('ios')) {
      return 'and-ios.png';
    }

    const icons: { [key: string]: string } = {
      android: 'android.svg',
      ios: 'ios.svg',
      windows: 'windows.svg'
    };

    return icons[os[0]] || 'unknown.svg';
  }

  // date time range components

  getDateTimeRange(dateTimeRange) {
    this.dateRange['startDateTime'] = dateTimeRange['startDateTime'];
    this.dateRange['endDateTime'] = dateTimeRange['endDateTime'];
    this.dateRangeOption = dateTimeRange['dateTimeRangeOption'];
  }
  // alloffercount(filter: any) {
  //   this.offerService.countOffers(filter).subscribe({
  //     next: (res: any) => {
  //       this.offercount = res?.payload?.count || 0;
  //       // console.log("total offer", this.offercount);
  //     },
  //     error: () => {
  //       this.offercount = 0;
  //     }
  //   });
  // }

  // alloffercount(data: any) {
  //   this.offerService.countOffers(data).subscribe(
  //     (res: any) => {
  //       // console.log("API Response:", res);

  //       if (res && res.payload) {
  //         this.offercount = res.payload.count
  //         console.log("All Offer Length:", this.offercount);
  //       }

  //       if (Array.isArray(res)) {
  //         console.log("All Offer Length:", res.length);
  //       }
  //     },
  //     (error) => {
  //       console.error("API Error:", error);
  //     }
  //   );
  // }

  // getOSIcon(os: string[]): string {
  //   // if (os.includes('android') && os.includes('ios')) {
  //   //   return 'all.png';
  //   // }
  //   const icons: { [key: string]: string } = {
  //     android: 'android.svg',
  //     ios: 'ios.svg',
  //     windows: 'windows.svg'
  //   };
  //   return icons[os[0]] || 'unknown.svg';
  // }
  // getOSIcon(os: string): string {
  //   const icons: { [key: string]: string } = {
  //     android: 'android.svg',
  //     ios: 'ios.svg',
  //     windows: 'windows.svg',
  //     all: 'all.png'
  //   };
  //   return icons[os] || 'unknown.svg';
  // }
}