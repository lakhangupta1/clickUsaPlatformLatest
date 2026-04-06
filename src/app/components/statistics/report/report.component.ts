import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiselectedComponent } from "../../../shared/multiselected/multiselected.component";
import { NgbCalendar, NgbDate, NgbModal, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { IModal } from 'src/app/shared/model/model/model.component';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReportService } from 'src/app/services/report.service';
import { DatetimeRangePickerComponent } from "../../../shared/datetime-range-picker/datetime-range-picker.component";
import { groupFields, columnFields, maxDate } from 'src/app/shared/model/statistics.model'
import { publisherConversionFields } from 'src/app/shared/model/conversion.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { Shorten2Pipe } from 'src/app/shared/shorten/shorten.pipe';
import { Globalconstant } from 'src/app/const/global'
import * as countryTimezone from 'countries-and-timezones';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule, FormsModule, RouterModule, DatetimeRangePickerComponent, NgSelectModule, Shorten2Pipe, NgbTooltipModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  db_name: any;
  field_name: any;
  selected: boolean;
  description: string;
  isHidden: boolean = true;
  maxDate = maxDate;
  pubConColList = publisherConversionFields.map(x => Object.assign({}, x));
  groupField = groupFields.map(x => ({ ...x }));
  columnField = columnFields.map(x => ({ ...x }));
  pubReportColList = [...groupFields, ...columnFields];
  // timezoneList = Globalconstant.config.timeZones;
  selectedTimezone: string = '';
  currSelectedColumns = [];
  groupSelectedColumns = [];
  projSelectedColumns = [];
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'db_name',
    textField: 'field_name',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    allowSearchFilter: true
  };
  isPagination: boolean = false;
  showOptions = false;
  totalReportCount: number = 0;
  offerId = "";
  offerName = "";
  limit = 100;
  currentPage: number = 1;
  allReportList: any = [];
  reportTotalSumData: any = {};
  reportGrossData: any = {};
  rangeOption = '1';
  clickId = "";
  filterDate: any = { startDateTime: new Date(new Date().setHours(0, 0, 0, 0)), endDateTime: new Date() };
  modal: IModal;
  selectedDateTimeRange: string = '';
  // page = 1;
  // pageSize = 1000;
  userList = 0;
  public countryList = [];
  public timezoneList = [];
  country = "";
  // export filter

  exportSelectedColumns: any[] = [];

  exportStartDate: string = new Date(
    new Date().setDate(new Date().getDate() - 1)
  ).toISOString().substring(0, 10);

  exportEndDate: string = new Date().toISOString().substring(0, 10);
  constructor(
    private calendar: NgbCalendar,
    private toasterService: ToastrService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private modalService: NgbModal,
    private reportService: ReportService
  ) {
    // console.log(" file: publisher-reports.component.ts ~ line 229 ~ PublisherReportsComponent ~ getFilter ~ this.filterDate.startDateTime.toJSON()", this.filterDate.startDateTime.toJSON())
    // this.countryList = Globalconstant.config.country;

    for (let item of this.pubReportColList) {
      if (item['selected']) {
        this.currSelectedColumns.push({ db_name: item['db_name'], field_name: item['field_name'] });
      }
    }
  }

  ngOnInit(): void {
    this.loadAllTimezones();
    // console.log("pubConColList", this.pubConColList);
    // console.log("field--group==>", groupFields)
    // console.log("pubReportColList===>", this.pubReportColList)
    // console.log("dropdownSettings==>", this.dropdownSettings)
    // console.log("dropdownData-->", this.pubReportColList);
    // console.log("currSelectedColumns-->", this.currSelectedColumns);
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['offer_id']) {
        this.offerId = params['offer_id'];
      }
      if (params['offer_name']) {
        this.offerName = params['offer_name'];
      }
      if (params['source']) {
        this.clickId = params['source'];
      }
      if (params['start_date']) {
        this.filterDate['startDateTime'] = new Date(params['start_date']);
      }
      if (params['end_date']) {
        this.filterDate['endDateTime'] = new Date(params['end_date']);
      }
      if (params['page']) {
        // this.currentPage = +params['page'];
        // this.currentPage = params['page'] ? +params['page'] : 1;
        this.currentPage = Number(params['page']) || 1;
      }
      if (params['limit']) {
        this.limit = +params['limit'] || 100;
      }
      this.onFilter(true);
    });


    // console.log("currSelectedColumns-->", this.currSelectedColumns);
  }

  getFilter() {

    let filter = {};
    let navigateParam = {};

    if (this.clickId.trim()) {
      filter['source'] = navigateParam['source'] = this.clickId.trim();
    }

    if (this.offerId.trim()) {
      filter['offer_id'] = [this.offerId.trim()]
      if (this.offerId.includes(',')) {
        filter['offer_id'] = this.offerId.split(',').reduce((arr, curr) => {
          if (curr) { arr.push(curr) };
          return arr;
        }, []);
        if (filter['offer_id'].length > 10) {
          this.toasterService.info('Maximum limit of offer ids is 10.', 'Info!');
          return {};
        }
      }
      navigateParam['offer_id'] = filter['offer_id']
    }

    if (this.offerName.trim()) {
      filter['offer_name'] = navigateParam['offer_name'] = this.offerName.trim();
    }

    if (this.filterDate) {
      filter['start_date'] = navigateParam['start_date'] = this.filterDate.startDateTime.toISOString();
      filter['end_date'] = navigateParam['end_date'] = this.filterDate.endDateTime.toISOString();
    }
    if (this.selectedTimezone) {
      filter['timezone'] = this.selectedTimezone;
    }
    if (this.currSelectedColumns.length) {
      let groupCol = [];
      let projCol = [];
      this.groupSelectedColumns = [];
      this.projSelectedColumns = [];

      for (const tmpObj of this.currSelectedColumns) {
        let colmnSearchResult = this.columnField.some(ele => ele.db_name === tmpObj.db_name)
        if (colmnSearchResult) {
          projCol.push(tmpObj.db_name);
          this.projSelectedColumns.push(tmpObj);
        }
        else {
          let groupSearchResult = this.groupField.some(ele => ele.db_name === tmpObj.db_name)
          if (groupSearchResult) {
            groupCol.push(tmpObj.db_name);
            this.groupSelectedColumns.push(tmpObj);
          }
        }
      }
      filter['column'] = projCol;
      filter['group'] = groupCol;
    }

    if (this.limit) {
      filter['limit'] = navigateParam['limit'] = this.limit;
    }

    if (this.currentPage) {
      filter['page'] = navigateParam['page'] = this.currentPage;
    }

    filter['sort'] = {};

    if (filter['start_date'] && filter['end_date']) {
      const startTime = new Date(filter['start_date']).getTime();
      const endTime = new Date(filter['end_date']).getTime();

      const diffInMs = endTime - startTime;
      const fifteenDaysInMs = 15 * 24 * 60 * 60 * 1000;

      if (diffInMs <= fifteenDaysInMs) {
        filter['live'] = true;
      } else {
        filter['dailyLive'] = true;
      }
    }
    // if (!this.router.url.includes('page=' + this.currentPage)) {
    //   this.navigateToLink(navigateParam);
    // }
    // this.navigateToLink(navigateParam);

    return filter;
  }
  onFilter(isPagination = false) {
    // this.totalReportCount = 0;
    this.isPagination = isPagination;
    // console.log("totalReportCount-1",this.totalReportCount);
    let filterData = this.getFilter();
    // console.log("filterData",filterData);

    if (JSON.stringify(filterData) === JSON.stringify({})) {
      this.toasterService.info('Select at least 1 filter', 'Info!');
      return;
    }
    if (filterData['group'].length <= 0) {
      this.toasterService.info('Select offer or source or day or month, at least one', 'Info!');
      return;
    }
    if (filterData['group'].includes('day') && filterData['group'].includes('month')) {
      filterData['group'] = filterData['group'].filter(ele => ele != 'day');
      this.toasterService.info('Select day or month, only one at a time!', 'Info!');
      return;
    }

    // this.allReportList = [];
    this.reportTotalSumData = { 'click': 0, 'conversion': 0, 'payout': 0 };
    this.reportGrossData = { 'click': 0, 'conversion': 0, 'payout': 0 };

    if (filterData['dailyLive']) {
      this.reportService.getPubSummaries(filterData).subscribe({
        next: (data) => {
          this.totalReportCount = data['payload']['count'];
          // console.log("count", this.totalReportCount);
          if (data['err']) {
            this.toasterService.error(data['msg'], 'Error!');
          } else {
            this.totalReportCount = data['payload']['count'];
            if (data['payload']['data'].length && data['payload']['data'].length) {
              this.allReportList = data['payload']['data'];
              if (filterData['column'].includes('click')) {
                this.reportTotalSumData['click'] = this.sumValue(this.allReportList, 'click');
              }
              if (filterData['column'].includes('conversion')) {
                this.reportTotalSumData['conversion'] = this.sumValue(this.allReportList, 'conversion');
              }
              if (filterData['column'].includes('payout')) {
                this.reportTotalSumData['payout'] = this.sumValue(this.allReportList, 'payout');
              }

              delete filterData['limit'];
              delete filterData['page'];

              this.reportService.getPubGrossSummaries(filterData).subscribe(grossData => {
                if (grossData['err']) {
                  this.toasterService.error(grossData['msg'], 'Error!');
                } else if (grossData['payload'].length) {
                  if (grossData['payload'][0]['click']) {
                    this.reportGrossData['click'] = grossData['payload'][0]['click'];
                  }
                  if (grossData['payload'][0]['conversion']) {
                    this.reportGrossData['conversion'] = grossData['payload'][0]['conversion'];
                  }
                  if (grossData['payload'][0]['payout']) {
                    this.reportGrossData['payout'] = grossData['payload'][0]['payout'];
                  }
                }
              }, err => {
                this.toasterService.error('Something went wrong. Please try again.', 'Error!');
              });
            }
            else {
              this.toasterService.error("Report not found!", 'Error!');
            }
          }
        },
        error: (err) => {
          this.toasterService.error('Something went wrong. Please try again.', 'Error!');
        }
      });
    }
    else {
      this.reportService.getSummaries(filterData).subscribe({
        next: (data) => {
          // this.totalReportCount = data['payload'].count;
          // console.log("count -2", this.totalReportCount);
          // console.log("data -- ", data['payload']['gross_result'])
          if (data['err']) {
            this.toasterService.error(data['msg'], 'Error!');
          } else {
            this.totalReportCount = data['payload']['count'];
            const totalPages = Math.ceil(this.totalReportCount / this.limit);

            if (this.currentPage > totalPages && totalPages > 0) {
              this.currentPage = totalPages;
            }
            if (data['payload']['data'].length && data['payload']['data'].length) {
              this.allReportList = data['payload']['data'];
              if (filterData['column'].includes('click')) {
                this.reportTotalSumData['click'] = this.sumValue(this.allReportList, 'click');
              }
              if (filterData['column'].includes('conversion')) {
                this.reportTotalSumData['conversion'] = this.sumValue(this.allReportList, 'conversion');
              }
              if (filterData['column'].includes('payout')) {
                this.reportTotalSumData['payout'] = this.sumValue(this.allReportList, 'payout');
              }

              delete filterData['limit'];
              delete filterData['page'];

              this.reportService.getGrossSummaries(filterData).subscribe({
                next: grossData => {
                  if (grossData['err']) {
                    this.toasterService.error(grossData['msg'], 'Error!');
                  } else if (grossData['payload'].length) {
                    if (grossData['payload'][0]['click']) {
                      this.reportGrossData['click'] = grossData['payload'][0]['click'];
                    }
                    if (grossData['payload'][0]['conversion']) {
                      this.reportGrossData['conversion'] = grossData['payload'][0]['conversion'];
                    }
                    if (grossData['payload'][0]['payout']) {
                      this.reportGrossData['payout'] = grossData['payload'][0]['payout'];
                    }
                  }
                },
                error: (err) => {
                  this.toasterService.error('Something went wrong. Please try again.', 'Error!');
                }
              });
            }
            else {
              this.toasterService.error("Report not found!", 'Error!');
            }
          }
        },
        error: (err) => {
          this.toasterService.error('Something went wrong. Please try again.', 'Error!');
        }
      })
    }
  }



  onReset() {
    this.currSelectedColumns = [];
    this.groupSelectedColumns = [];
    this.projSelectedColumns = [];
    for (let item of this.pubReportColList) {
      if (item['selected']) {
        this.currSelectedColumns.push({ db_name: item['db_name'], field_name: item['field_name'] });
        let colmnSearchResult = columnFields.some(ele => ele.db_name === item.db_name);
        if (colmnSearchResult) {
          this.projSelectedColumns.push(item);
        } else {
          let groupSearchResult = groupFields.some(ele => ele.db_name === item.db_name);
          if (groupSearchResult) {
            this.groupSelectedColumns.push(item);
          }
        }
      }
    }
    this.totalReportCount = 0;
    this.offerId = "";
    this.offerName = "";
    this.clickId = "";
    this.filterDate = { startDateTime: new Date(new Date().setHours(0, 0, 0, 0)), endDateTime: new Date() };
    this.limit = 100;
    this.currentPage = 1;
    this.allReportList = [];
    this.reportTotalSumData = {};
    this.reportGrossData = {};
    this.rangeOption = '1';
  }

  // sumValue(obj, field) {
  //   return obj.reduce((sum, item) => sum + parseFloat(item[field] || 0), 0);
  // }
  sumValue(obj, field) {
    return obj.reduce((sum, item) => sum + Number(parseFloat(item[field] || 0).toFixed(3)), 0);
  }
  formatDateTime(date: NgbDate, time: { hour: number, minute: number }): string {
    const formattedDate = `${date.year}/${date.month < 10 ? '0' + date.month : date.month}/${date.day < 10 ? '0' + date.day : date.day}`;
    const formattedTime = `${time.hour < 10 ? '0' + time.hour : time.hour}:${time.minute < 10 ? '0' + time.minute : time.minute}`;
    return `${formattedDate}, ${formattedTime}`;
  }

  // getPage(page: number) {
  //   this.currentPage = page;
  //   this.onFilter(true);
  //   console.log('Page changed to:', page);
  // }

  getPage(page: number) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page: page,
        limit: this.limit
      },
      queryParamsHandling: 'merge'
    });
  }

  onColumnSelect(event) {
    // console.log('Selected Columns:', event);
    this.currSelectedColumns = event;
  }

  navigateToLink(obj) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: obj,
      skipLocationChange: false
    });
  }

  toggleDatetimepicker() {
    this.isHidden = !this.isHidden;
  }

  getDateTimeRangeData(dateTimeRange) {
    this.filterDate['startDateTime'] = dateTimeRange['startDateTime'];
    this.filterDate['endDateTime'] = dateTimeRange['endDateTime'];
    this.rangeOption = dateTimeRange['dateTimeRangeOption'];
  }
  selectPubConColList = [
    { field_name: 'Select All' },
    ...this.pubReportColList
  ];

  get isAllSelected() {
    return this.currSelectedColumns.length === this.pubReportColList.length;
  }

  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.currSelectedColumns = [...this.pubReportColList];
    } else {
      this.currSelectedColumns = [];
    }
  }

  round(value: number): number {
    if (value === null || value === undefined) return 0;
    return Number(parseFloat(value as any).toFixed(3));
  }


  // export offer filter

  getExportFilter() {

    let filter: any = {};

    let groupCol: any[] = [];
    let projCol: any[] = [];

    if (this.exportSelectedColumns.length) {

      // this.exportSelectedColumns.forEach(col => {

      //   // let columnSearch = this.columnField.some(ele => ele.db_name === col.db_name);
      //   let columnSearch = this.columnField.some(ele => ele.db_name === col);
      //   if (columnSearch) {
      //     projCol.push(col);
      //   }
      //   else {
      //     // let groupSearch = this.groupField.some(ele => ele.db_name === col.db_name);
      //     let groupSearch = this.groupField.some(ele => ele.db_name === col);
      //     if (groupSearch) {
      //       groupCol.push(col);
      //     }
      //   }

      // });
      // this.exportSelectedColumns.forEach(col => {

      //   let columnSearch = this.columnField.some(ele => ele.db_name === col.db_name);

      //   if (columnSearch) {
      //     projCol.push(col.db_name);
      //   }
      //   else {

      //     let groupSearch = this.groupField.some(ele => ele.db_name === col.db_name);

      //     if (groupSearch) {
      //       groupCol.push(col.db_name);
      //     }

      //   }

      // });

      this.exportSelectedColumns.forEach(col => {

        const key = typeof col === 'string' ? col : col?.db_name;

        if (!key) return;

        const columnSearch = this.columnField.some(ele => ele.db_name === key);

        if (columnSearch) {
          projCol.push(key);
        } else {

          const groupSearch = this.groupField.some(ele => ele.db_name === key);

          if (groupSearch) {
            groupCol.push(key);
          }

        }

      });

    }

    filter['column'] = projCol;

    filter['group'] = groupCol;

    if (this.exportStartDate) {
      filter['start_date'] = new Date(this.exportStartDate).toISOString();
    }

    if (this.exportEndDate) {
      filter['end_date'] = new Date(this.exportEndDate).toISOString();
    }
    if (this.selectedTimezone) {
      filter['timezone'] = this.selectedTimezone;
    }
    filter['sort'] = {};

    if (filter['start_date'] && filter['end_date']) {

      const startTime = new Date(filter['start_date']).getTime();
      const endTime = new Date(filter['end_date']).getTime();

      const diff = endTime - startTime;

      const fifteenDays = 15 * 24 * 60 * 60 * 1000;

      if (diff <= fifteenDays) {
        filter['live'] = true;
      }
      else {
        filter['dailyLive'] = true;
      }

    }

    return filter;

  }

  compareDb = (a: any, b: any) => {
    return a && b && a === b;
  };
  exportReport() {

    const filterData = this.getExportFilter();

    filterData.limit = 1000000;
    filterData.page = 1;

    // if (!filterData['group'] || filterData['group'].length === 0) {
    //   this.toasterService.info('Select at least one group column 1', 'Info!');
    //   return;
    // }

    if (!filterData['column'] || filterData['column'].length === 0) {
      this.toasterService.info('Select at least one column 2', 'Info!');
      return;
    }

    if (filterData['dailyLive']) {

      this.reportService.getPubSummaries(filterData).subscribe({
        next: (data) => {

          if (data['err']) {
            this.toasterService.error(data['msg'], 'Error!');
            return;
          }

          const exportData = data['payload']['data'] || [];

          if (exportData.length === 0) {
            this.toasterService.warning("No data found", "Warning");
            return;
          }

          this.generateCSV(exportData);

        }
      });

    }
    else {

      this.reportService.getSummaries(filterData).subscribe({
        next: (data) => {

          if (data['err']) {
            this.toasterService.error(data['msg'], 'Error!');
            return;
          }

          const exportData = data['payload']['data'] || [];

          if (exportData.length === 0) {
            this.toasterService.warning("No data found", "Warning");
            return;
          }

          this.generateCSV(exportData);

        }
      });

    }

  }

  generateCSV(data: any[]) {

    const escapeCSV = (value: any) => {
      if (value === null || value === undefined) return '""';
      let v = String(value).replace(/"/g, '""');
      return `"${v}"`;
    };

    let headers = [];

    // this.exportSelectedColumns.forEach(col => {
    //   headers.push(col.field_name);
    // });
    // this.exportSelectedColumns.forEach(col => {

    //   const column = this.pubConColList.find(x => x.db_name === col.db_name);

    //   headers.push(column?.field_name || col.db_name);

    // });
    this.exportSelectedColumns.forEach(col => {

      const key = typeof col === 'string' ? col : col.db_name;

      const column = this.pubConColList.find(x => x.db_name === key);

      headers.push(column?.field_name || key);

    });
    let csvRows = [];

    csvRows.push(headers.map(h => escapeCSV(h)).join(','));

    data.forEach((item) => {

      let row = [];


      // this.exportSelectedColumns.forEach(col => {

      //   if (col === 'offer') {
      //     row.push(`${item.offer_name} (${item['_id']?.offer_id})`);
      //   }

      //   else if (col === 'source') {
      //     row.push(item['_id']?.source || '');
      //   }

      //   else if (col === 'day' || col === 'month') {

      //     let date = '';

      //     if (item['_id']?.year) date += item['_id'].year;
      //     if (item['_id']?.month) date += '/' + item['_id'].month;
      //     if (item['_id']?.day) date += '/' + item['_id'].day;

      //     row.push(date);
      //   }

      //   else if (col !== 'cr') {
      //     row.push(item[col] || 0);
      //   }

      //   else {

      //     let cr = item['click']
      //       ? ((item['conversion'] / item['click']) * 100)
      //       : 0;

      //     row.push(Number(cr.toFixed(3)));
      //   }

      // });
      this.exportSelectedColumns.forEach(col => {

        // const key = col.db_name;
        const key = typeof col === 'string' ? col : col.db_name;

        if (key === 'offer') {
          row.push(`${item.offer_name} (${item['_id']?.offer_id})`);
        }

        else if (key === 'source') {
          row.push(item['_id']?.source || '');
        }

        else if (key === 'day' || key === 'month') {

          let date = '';

          if (item['_id']?.year) date += item['_id'].year;
          if (item['_id']?.month) date += '/' + item['_id'].month;
          if (item['_id']?.day) date += '/' + item['_id'].day;

          row.push(date);
        }

        else if (key !== 'cr') {
          row.push(item[key] || 0);
        }

        else {

          let cr = item['click']
            ? ((item['conversion'] / item['click']) * 100)
            : 0;

          row.push(Number(cr.toFixed(3)));
        }

      });
      csvRows.push(row.map(v => escapeCSV(v)).join(','));

    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });

    const url = window.URL.createObjectURL(blob);


    const link = document.createElement('a');

    link.href = url;

    const today = new Date();
    const todayFormatted = today.toISOString().substring(0, 10);

    const startFormatted = this.exportStartDate;
    const endFormatted = this.exportEndDate;

    if (startFormatted === endFormatted && endFormatted === todayFormatted) {
      link.download = `Report_${todayFormatted}.csv`;
    }
    else {
      link.download = `Report_${startFormatted}_to_${endFormatted}.csv`;
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  compareColumns = (a: any, b: any) => {
    return a && b && a.db_name === b.db_name;
  };

  openExportModal(content: any) {

    // this.exportSelectedColumns = this.currSelectedColumns.map(
    //   (item: any) => item.db_name
    // );
    this.exportSelectedColumns = this.currSelectedColumns.map(
      (item: any) => {
        return this.pubReportColList.find(x => x.db_name === item.db_name);
      }).filter(x => x);
    // console.log('exportSelectedColumns', this.exportSelectedColumns);
    this.exportSelectedColumns = [...this.exportSelectedColumns];

    this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });

  }

  confirmExport(modal: any) {
    modal.close();
    this.exportReport();
  }

  cancelExport(modal: any) {

    modal.dismiss('cancel');

    this.exportSelectedColumns = [];

    this.exportStartDate = new Date(
      new Date().setDate(new Date().getDate() - 1)
    ).toISOString().substring(0, 10);

    this.exportEndDate = new Date().toISOString().substring(0, 10);

    this.toasterService.info('Export cancelled and filters reset', 'Info');

  }

  loadAllTimezones() {
    const zones = countryTimezone.getAllTimezones();

    this.timezoneList = Object.keys(zones).map(key => ({
      name: key,
      dstOffsetStr: zones[key].utcOffsetStr
    }));

    // console.log("timezoneList", this.timezoneList);
  }
}
