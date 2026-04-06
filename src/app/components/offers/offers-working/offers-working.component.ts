import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbPaginationModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { OffersService } from 'src/app/services/offers.service';
import { DatetimeRangePickerComponent } from 'src/app/shared/datetime-range-picker/datetime-range-picker.component';
import { workingOffersfields } from 'src/app/shared/model/working-offers';
import { ShortenPipe } from 'src/app/shared/shorten/shorten.pipe';

@Component({
  selector: 'app-offers-working',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatetimeRangePickerComponent,
    NgSelectModule,
    RouterModule,
    ShortenPipe,
    NgbPopoverModule,
    NgbPaginationModule],
  templateUrl: './offers-working.component.html',
  styleUrl: './offers-working.component.scss'
})
export class OffersWorkingComponent implements OnInit {
  pubOffColList = workingOffersfields.map(x => Object.assign({}, x));
  showOptions = false;
  dateRangeOption: string = '1';
  app_id: string = '';
  offerName: string = '';
  limit: number = 100;
  offerId: string = '';
  assignedOffers: any = false;
  currentPage: number = 1;
  totalOffers: number = 0;
  currSelectColumns = [];
  prevSelectedColumns: any[] = [];
  allOfferList: any[] = [];
  page = 1;
  pageSize = 1000;
  jumpPage = 1;

  dateRange: any = { startDateTime: new Date().setHours(0, 0, 0, 0), endDateTime: new Date() };

  constructor(private offerservce: OffersService,
    private modalService: NgbModal,
    private toasterService: ToastrService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    for (let item of this.pubOffColList) {
      if (item['selected']) {
        this.currSelectColumns.push({ db_name: item['db_name'], field_name: item['field_name'] });
      }
    }
    this.prevSelectedColumns = this.currSelectColumns;
   }

  ngOnInit(): void {
    // console.log('prevSelectedColumns', this.prevSelectedColumns);
    // console.log('allOfferList', this.allOfferList);
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['offer_id']) {
        this.offerId = params['offer_id'];
      }
      if (params['offer_name']) {
        this.offerName = params['offer_name'];
      }
      if (params['app_id']) {
        this.app_id = params['app_id'];
      }
      if (params['start_date']) {
        this.dateRange['startDateTime'] = new Date(params['start_date']);
      }
      if (params['end_date']) {
        this.dateRange['endDateTime'] = new Date(params['end_date']);
      }
      if (params['page']) {
        this.currentPage = +params['page'];
      }
      if (params['limit']) {
        this.limit = +params['limit'];
      }
    });
    this.onFilter();
    // console.log("pubOffColList", this.pubOffColList)
  }

  onFilter() {
    this.totalOffers = 0;
    this.allOfferList = [];
    this.prevSelectedColumns = this.currSelectColumns;
    let filterData = this.getFilter();
    filterData['assignedOffers'] = this.assignedOffers;
    this.offerservce.getWorkingOffers(filterData).subscribe(result => {
      if (result['err']) {
        this.toasterService.error(result['msg'], "Error!");
      } else {
        this.totalOffers = result['payload']['totalOffers'];
        this.currentPage = result['payload']['page'];
        this.allOfferList = result['payload']['result'];
        // console.log("allOfferListww", this.allOfferList)
      }
    })
  }
  selectPubConColList = [
    { field_name: 'Select All' },
    ...this.pubOffColList
  ];

  get isAllSelected() {
    return this.currSelectColumns.length === this.pubOffColList.length;
  }

  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.currSelectColumns = [...this.pubOffColList];
    } else {
      this.currSelectColumns = this.currSelectColumns.filter(col =>
        !this.pubOffColList.includes(col)
      );
    }
  }
  onColumnSelect(event: any) {
    this.currSelectColumns = event;
  }
  getFilter() {
    let filter = { search: { 'workingOffers': true, offer_type: "active_offers" }, projection: {}, projectionRef: {}, options: {}, sort: {} };
    let navigateParam = {};
    if (this.offerId) {
      filter['search']['offer_id'] = navigateParam['offer_id'] = this.offerId;
    }
    if (this.offerName) {
      filter.search['offer_name'] = navigateParam['offer_name'] = this.offerName;
    }

    if (this.app_id) {
      filter.search['app_id'] = navigateParam['app_id'] = this.app_id;
    }

    if (this.dateRange) {
      filter['search']['start_date'] = navigateParam['start_date'] = this.dateRange.startDateTime;
      filter['search']['end_date'] = navigateParam['end_date'] = this.dateRange.endDateTime;
    }
    if (this.currSelectColumns && this.currSelectColumns.length) {
      this.currSelectColumns.map(ele => {
        filter['projection'][ele.db_name] = 1;
        filter['projectionRef'][ele.db_name] = ele.field_name;
      })
    }

    if (this.limit) {
      filter['options']['limit'] = navigateParam['limit'] = +this.limit;
    }
    if (this.currentPage) {
      filter.options['page'] = navigateParam['page'] = +this.currentPage;
    }

    this.navigateToLink(navigateParam);
    return filter;
  }

  navigateToLink(obj: any) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: obj,
      skipLocationChange: false
    })
  }


  getDateTimeRange(dateTimeRange) {
    this.dateRange['startDateTime'] = dateTimeRange['startDateTime'];
    this.dateRange['endDateTime'] = dateTimeRange['endDateTime'];
    this.dateRangeOption = dateTimeRange['dateTimeRangeOption'];
  }

  checkAppId(app_id: any): string {
    if (this.validateOsType(app_id)) {
      return 'android';
    } else if (app_id == "") {
      return '';
    } else if (!isNaN(app_id)) {
      return 'ios';
    }
    return 'unknown';
  }

  determineCase(item: any): string {
    const res = this.checkAppId(item.app_id)
    if (item['device_targeting'] && item['device_targeting'].os == 'all') {
      return 'all';
    }
    else if (item['device_targeting'] && item['device_targeting'].os == 'windows') {
      return 'windows';
    }
    else if (res == 'android' && item['device_targeting'] && item['device_targeting'].os == 'android')
      return 'android';
    else if (res == 'ios' && item['device_targeting'] && item['device_targeting'].os == 'ios')
      return 'ios';
    else if (res == 'android') {
      return 'android';
    } else if (res == 'ios') {
      return 'ios';
    }
    else {
      return 'none';
    }
  }

  validateOsType(appId: any) {
    const androidAppIdRegex = /^([A-Za-z]{1}[A-Za-z\d_]*\.)+[A-Za-z][A-Za-z\d_]*$/;
    if (androidAppIdRegex.test(appId)) {
      return true;
    } else {
      return false;
    }
  }

  getOSIcon(os: string[]): string {
    const icons: { [key: string]: string } = {
      android: 'android.svg',
      ios: 'ios.svg',
      windows: 'windows.svg'
    };
    return icons[os[0]] || 'unknown.svg';
  }
  getPage(page) {
    this.page = page;
    this.onFilter();
    // console.log('Page changed to:', page);
  }

  

}
