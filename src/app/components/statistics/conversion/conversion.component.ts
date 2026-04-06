import { Component } from '@angular/core';
import { MultiselectedComponent } from "../../../shared/multiselected/multiselected.component";
import { NgbCalendar, NgbDate, NgbModal, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { DatetimeRangePickerComponent } from '../../../shared/datetime-range-picker/datetime-range-picker.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConversionLogService } from 'src/app/services/conversion-log.service';
import { ToastrService } from 'ngx-toastr';
import { publisherConversionFields } from 'src/app/shared/model/conversion.model'
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ShortenPipe, Shorten2Pipe, Shorten5Pipe } from 'src/app/shared/shorten/shorten.pipe';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Globalconstant } from 'src/app/const/global'
import * as countryTimezone from 'countries-and-timezones';


@Component({
  selector: 'app-conversion',
  standalone: true,
  imports: [CommonModule,
    NgbPaginationModule,
    DatetimeRangePickerComponent,
    RouterModule,
    NgbTooltipModule,
    Shorten2Pipe,
    FormsModule,
    NgSelectModule,
    Shorten5Pipe],
  templateUrl: './conversion.component.html',
  styleUrl: './conversion.component.scss'
})
export class ConversionComponent {

  pubConColList = publisherConversionFields.map(x => Object.assign({}, x));
  currSelectedColumns = [];
  prevSelectedColumns = [];
  // dropdownSettings: IDropdownSettings = {
  //   idField: 'db_name',
  //   textField: 'field_name'
  // };
  // timezoneList = Globalconstant.config.timeZones;
  public countryList = [];
  public timezoneList = [];
  country = "";
  selectedTimezone: string = '';

  isHidden: boolean = true;
  selectedDateTimeRange: string = '';
  showOptions = false;
  rangeOption = '1';
  dateRangeOption: string = '1';
  totalConversion: number = 0;
  offerId: string = '';
  clickId: string = '';
  offerName: string = '';
  limit: number = 100;
  currentPage: number = 1;
  allConversionList: any = [];
  // page = 1;
  pageSize: number = 100;
  totalItems: number = 0;
  userList = 0;
  allData: any[] = [];
  paginatedData: any[] = [];
  dateRange: any = { startDateTime: new Date(new Date().setHours(0, 0, 0, 0)), endDateTime: new Date() };

  // export data
  exportOfferId: string = '';
  exportOfferName: string = '';
  exportClickId: string = '';
  exportLimit: number = 1000;
  exportSelectedColumns: any[] = [];
  // exportStartDate: any;  
  //  exportEndDate: any ;
  today: Date = new Date();
  yesterday: Date = new Date(new Date().setDate(new Date().getDate() - 1));

  exportStartDate: any = this.yesterday;
  exportEndDate: any = this.today;

  constructor(private calendar: NgbCalendar,
    private activatedRoute: ActivatedRoute,
    private conversionLogService: ConversionLogService,
    private toasterService: ToastrService,
    private modalService: NgbModal,
    public router: Router
  ) {
    this.countryList = Globalconstant.config.country;
    for (let item of this.pubConColList) {
      if (item['selected']) {
        this.currSelectedColumns.push({ db_name: item['db_name'], field_name: item['field_name'] });
      }
    }
    this.prevSelectedColumns = this.currSelectedColumns;
  }
  ngOnInit() {
    this.loadAllTimezones()
    this.generateData();
    // this.getPage(this.page);
    // console.log("totalItems",this.totalItems);
    // console.log("prevSelectedColumns", this.prevSelectedColumns);
    // console.log("pubConColList--", this.pubConColList);
    // console.log("currSelectedColumns--", this.currSelectedColumns);
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['offer_id']) {
        this.offerId = params['offer_id'];
      }
      if (params['offer_name']) {
        this.offerName = params['offer_name'];
      }
      if (params['click_id']) {
        this.clickId = params['click_id'];
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
  }
  // onFilter() {

  //   this.totalConversion = 0;
  //   this.allConversionList = [];
  //   this.prevSelectedColumns = this.currSelectedColumns;

  //   let filterData = this.getFilter();

  //   this.conversionLogService.getConversionLog(filterData).subscribe(apiResult => {
  //     if (apiResult['err']) {
  //       this.toasterService.error(apiResult['msg'], 'Error!');
  //     } else {
  //       this.totalConversion = apiResult['payload']['totalconversion'];
  //       this.currentPage = apiResult['payload']['page'];
  //       this.allConversionList = apiResult['payload']['result'];

  //       this.totalItems = apiResult['payload']['totalconversion'];

  //       this.generateData();
  //     }
  //   });
  // }

  onFilter() {
    this.totalConversion = 0;
    this.allConversionList = [];
    this.prevSelectedColumns = this.currSelectedColumns;

    const filterData = this.getFilter();

    this.conversionLogService.getConversionLog(filterData).subscribe(apiResult => {
      if (apiResult['err']) {
        this.toasterService.error(apiResult['msg'], 'Error!');
      } else {
        this.totalConversion = apiResult['payload'].totalconversion;
        this.currentPage = apiResult['payload'].page || 1;
        this.pageSize = this.limit;
        // console.log("totalConversion", apiResult['payload']['result']['5']['final_payout']);
        // this.allConversionList = apiResult['payload'].result;
        this.allConversionList = apiResult['payload'].result.map((item: any) => {
          if (item.final_payout) {
            item.final_payout = Number(item.final_payout).toFixed(3);
          }
          return item;
        });
        this.totalItems = apiResult['payload'].totalconversion;

      }
    });
  }


  getFilter() {
    // console.log("current-",this.currentPage);
    let filter = { search: {}, projection: {}, projectionRef: {}, options: {}, sort: {} };
    let navigateParam = {};

    if (this.offerId) {
      filter.search['offer_id'] = navigateParam['offer_id'] = this.offerId;
    }
    if (this.offerName) {
      filter.search['offer_name'] = navigateParam['offer_name'] = this.offerName;
    }
    if (this.clickId) {
      filter.search['click_id'] = navigateParam['click_id'] = this.clickId;
    }
    if (this.dateRange) {
      filter.search['start_date'] = navigateParam['start_date'] = this.dateRange.startDateTime.toISOString();
      filter.search['end_date'] = navigateParam['end_date'] = this.dateRange.endDateTime.toISOString();
    }
    if (this.currSelectedColumns && this.currSelectedColumns.length) {
      this.currSelectedColumns.map(obj => {
        filter.projection[obj.db_name] = 1;
        filter.projectionRef[obj.db_name] = obj.field_name;
      });
    }
    if (this.limit) {
      filter.options['limit'] = navigateParam['limit'] = +this.limit;
    }
    if (this.currentPage) {
      // console.log("cuuu--", this.currentPage);
      filter.options['page'] = navigateParam['page'] = +this.currentPage;
    }
    if (this.country) {
      filter.search['country'] = navigateParam['country'] = this.country;
    }
    if (this.selectedTimezone) {
      filter.search['timezone'] = navigateParam['timezone'] = this.selectedTimezone;
    }
    this.navigateToLink(navigateParam);
    return filter;
  }

  navigateToLink(obj) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: obj,
      skipLocationChange: false
    });
  }
  onColumnSelect(event) {
    this.currSelectedColumns = event;
  }
  toggleDatetimepicker() {
    this.isHidden = !this.isHidden;
  }
  updateDateTimeRange(fromDate: NgbDate, fromTime: { hour: number, minute: number }, toDate: NgbDate, toTime: { hour: number, minute: number }) {
    this.selectedDateTimeRange = `${this.formatDateTime(fromDate, fromTime)} - ${this.formatDateTime(toDate, toTime)}`;
  }

  formatDateTime(date: NgbDate, time: { hour: number, minute: number }): string {
    const formattedDate = `${date.year}/${date.month}/${date.day}`;
    const formattedTime = `${time.hour}:${time.minute < 10 ? '0' + time.minute : time.minute}`;
    return `${formattedDate}, ${formattedTime}`;
  }
  getDateTimeRange(dateTimeRange) {
    this.dateRange['startDateTime'] = dateTimeRange['startDateTime'];
    this.dateRange['endDateTime'] = dateTimeRange['endDateTime'];
    this.dateRangeOption = dateTimeRange['dateTimeRangeOption'];
  }

  generateData() {
    if (!this.totalItems) return;
    this.allData = Array.from({ length: this.totalItems }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`
    }));

    this.getPage(this.currentPage);
  }



  // getPage(page: number) {
  //   this.currentPage = page;
  //   const startIndex = (page - 1) * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;
  //   this.paginatedData = this.allData.slice(startIndex, endIndex);
  //   // this.onFilter();
  //   // console.log("current",this.currentPage);
  // }


  getPage(page: number) {
    this.currentPage = page;
    this.onFilter();
    // console.log('Page changed to:', page);
  }

  selectPubConColList = [
    { field_name: 'Select All' },
    ...this.pubConColList
  ];
  get isAllSelected() {
    return this.currSelectedColumns.length === this.pubConColList.length;
  }
  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.currSelectedColumns = [...this.pubConColList];
    } else {
      this.currSelectedColumns = this.currSelectedColumns.filter(col =>
        !this.pubConColList.includes(col)
      );
    }
  }
  getTotalValue() {
    if (this.totalConversion <= this.limit) {
      return this.totalConversion;
    } else {
      return (this.limit * this.currentPage > this.totalConversion)
        ? this.totalConversion
        : this.limit * this.currentPage;
    }
  }

  // ecport filter

  ExportFilter() {

    let filter: any = { search: {}, projection: {}, projectionRef: {}, options: {}, sort: {}, timezone: {} };

    if (this.exportOfferId) {
      filter.search['offer_id'] = this.exportOfferId;
    }

    if (this.exportOfferName) {
      filter.search['offer_name'] = this.exportOfferName;
    }

    if (this.exportClickId) {
      filter.search['click_id'] = this.exportClickId;
    }

    if (this.exportStartDate) {
      filter.search['start_date'] = new Date(this.exportStartDate).toISOString();
    }

    if (this.exportEndDate) {
      filter.search['end_date'] = new Date(this.exportEndDate).toISOString();
    }

    if (this.selectedTimezone) {
      filter.search['timezone'] = this.selectedTimezone;
    }

    if (this.exportSelectedColumns?.length) {
      this.exportSelectedColumns.forEach((obj: any) => {
        filter.projection[obj.db_name] = 1;
        filter.projectionRef[obj.db_name] = obj.field_name;
      });
    }

    // add options object
    filter.options['limit'] = 10000;
    filter.options['page'] = 1;

    return filter;
  }

  formatInputDate(date: Date) {
    const d = new Date(date);
    return d.toISOString().substring(0, 10);
  }

  openExportModal(content: any) {

    this.exportOfferId = this.offerId;
    this.exportOfferName = this.offerName;
    this.exportClickId = this.clickId;

    // this.exportStartDate = new Date(this.yesterday);
    // this.exportEndDate = new Date(this.today);
    this.exportStartDate = this.formatInputDate(this.dateRange['startDateTime']);
    this.exportEndDate = this.formatInputDate(this.dateRange['endDateTime']);

    this.exportLimit = this.limit;
    this.exportSelectedColumns = [...this.currSelectedColumns];

    this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });

  }

  cancelExport(modal: any) {
    modal.dismiss();
    this.toasterService.info('Export cancelled', 'Cancelled');
  }

  confirmExport(modal: any) {

    modal.close();

    this.toasterService.info('Generating CSV, please wait...');

    const filterData = this.ExportFilter();

    this.conversionLogService.getConversionLog(filterData)
      .subscribe(apiResult => {

        if (apiResult['err']) {
          this.toasterService.error(apiResult['msg'], 'Error!');
          return;
        }

        this.allConversionList = apiResult['payload'].result.map((item: any) => {
          if (item.final_payout) {
            item.final_payout = Number(item.final_payout).toFixed(3);
          }
          return item;
        });

        this.exportData();

      });

  }

  exportData() {

    if (!this.allConversionList || this.allConversionList.length === 0) {
      this.toasterService.warning("No data available to export");
      return;
    }

    const escapeCSV = (value: any) => {
      if (value === null || value === undefined) return '""';
      let v = String(value).replace(/"/g, '""');
      return `"${v}"`;
    };

    let headers: any[] = ['#'];

    this.exportSelectedColumns.forEach(col => {
      headers.push(col.field_name);
    });

    let csvRows: any[] = [];

    csvRows.push(headers.map(h => escapeCSV(h)).join(','));

    this.allConversionList.forEach((item, index) => {

      let row: any[] = [];
      row.push((index + 1));

      this.exportSelectedColumns.forEach(col => {

        let value = item[col.db_name];

        if (col.db_name === 'final_payout' && value) {
          value = Number(value).toFixed(3);
        }

        row.push(value ?? '');

      });

      csvRows.push(row.map(v => escapeCSV(v)).join(','));

    });

    const csvContent = csvRows.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    // link.download = `Conversion_Report.csv`;
    const formatDate = (date: Date) => {
      return date.getFullYear() + "_" +
        String(date.getMonth() + 1).padStart(2, '0') + "_" +
        String(date.getDate()).padStart(2, '0');
    };

    const start = new Date(this.exportStartDate);
    const end = new Date(this.exportEndDate);

    const today = new Date();

    const todayFormatted = formatDate(today);
    const startFormatted = formatDate(start);
    const endFormatted = formatDate(end);

    if (startFormatted === endFormatted && endFormatted === todayFormatted) {
      link.download = `Conversion_Report_${todayFormatted}.csv`;
    } else {
      link.download = `Conversion_Report_${startFormatted}_to_${endFormatted}.csv`;
    }


    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

    this.toasterService.success(
      `${this.allConversionList.length} rows exported`,
      "Export Success"
    );
  }

  // changeTimeZone(countryCode: string) {

  //   if (!countryCode) {
  //     this.timezoneList = [];
  //     this.selectedTimezone = null;
  //     return;
  //   }

  //   const timezones = countryTimezone.getTimezonesForCountry(countryCode);
  //   console.log("timezones", timezones);
  //   this.timezoneList = timezones ? Object.values(timezones) : [];
  //   console.log("this.timezoneList", this.timezoneList);
  // }

  loadAllTimezones() {
      const zones = countryTimezone.getAllTimezones();
  
      this.timezoneList = Object.keys(zones).map(key => ({
        name: key,
        dstOffsetStr: zones[key].utcOffsetStr
      }));
  
      // console.log("timezoneList", this.timezoneList);
    }
}
