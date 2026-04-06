import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from 'src/app/services/report.service';
import { DatetimeRangePickerComponent } from 'src/app/shared/datetime-range-picker/datetime-range-picker.component';
import { columnFields, geoGroupFields, groupFields, maxDate } from 'src/app/shared/model/statistics.model';
import { NgbModal, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Shorten2Pipe } from 'src/app/shared/shorten/shorten.pipe';
import { Globalconstant } from 'src/app/const/global'
import * as countryTimezone from 'countries-and-timezones';

interface GeoFilter {
  group: string[];
  column: string[];
  start_date: string;
  end_date: string;
  limit: number;
  page: number;
  sort?: {};
  live?: boolean;
  dailyLive?: boolean;
}

@Component({
  selector: 'app-geo-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatetimeRangePickerComponent,
    NgSelectModule,
    NgbPaginationModule,
    NgbTooltipModule, Shorten2Pipe,
    RouterLink
  ],
  templateUrl: './geo-reports.component.html',
  styleUrl: './geo-reports.component.scss'
})
export class GeoReportsComponent {

  maxDate = maxDate;

  columnField = columnFields.map(x => ({ ...x }));
  geoGroup = [...geoGroupFields];

  pubReportColList = [...columnFields];

  // countryList = Globalconstant.config.country;
  // timezoneList = Globalconstant.config.timeZones;
  public countryList = [];
  public timezoneList = [];
  selectedTimezone: string = '';
  currSelectedColumns: any[] = [];
  groupSelectedColumns: any[] = [];
  projSelectedColumns: any[] = [];

  limit = 100;
  currentPage = 1;
  totalReportCount = 0;

  allReportList: any[] = [];

  reportTotalSumData = { click: 0, conversion: 0, payout: 0 };
  reportGrossData = { click: 0, conversion: 0, payout: 0 };

  offerId = "";
  offerName = "";
  country = "";

  showOptions = false;

  rangeOption = '1';

  filterDate: any = {
    startDateTime: new Date(new Date().setHours(0, 0, 0, 0)),
    endDateTime: new Date()
  };

  exportSelectedColumns: any[] = [];

  constructor(
    private toaster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modal: NgbModal,
    private reportService: ReportService
  ) {
    this.countryList = Globalconstant.config.country;

    this.groupSelectedColumns =
      this.geoGroup.filter(x => x.selected);

    this.currSelectedColumns =
      this.columnField.filter(x => x.selected);

    this.projSelectedColumns = [...this.currSelectedColumns];

  }

  ngOnInit() {
    this.loadAllTimezones();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['offer_id']) {
        this.offerId = params['offer_id'];
      }
      if (params['offer_name']) {
        this.offerName = params['offer_name'];
      }
      if (params['isoCode']) {
        this.country = params['isoCode'];
      }
      if (params['start_date']) {
        this.filterDate['startDateTime'] = new Date(params['start_date']);
      }
      if (params['end_date']) {
        this.filterDate['endDateTime'] = new Date(params['end_date']);
      }
      if (params['page']) {

        this.currentPage = Number(params['page']) || 1;
      }
      if (params['limit']) {
        this.limit = +params['limit'] || 100;
      }
      this.loadReport();

    });


  }

  buildFilter(): GeoFilter {

    const group = [...new Set(
      this.groupSelectedColumns.map(x => x.db_name)
    )];

    const column =
      this.currSelectedColumns.map(x => x.db_name);

    const filter: any = {

      group,
      column,
      start_date: this.filterDate.startDateTime.toISOString(),
      end_date: this.filterDate.endDateTime.toISOString(),
      limit: this.limit,
      page: this.currentPage,
      sort: {}

    };

    if (this.offerId.trim()) {
      filter.oId = this.offerId.trim();
    }

    if (this.offerName.trim()) {
      filter.oName = this.offerName.trim();
    }

    if (this.country) {
      filter.isoCode = this.country;
    }

    if (this.selectedTimezone) {
      filter.timezone = this.selectedTimezone;
    }
    const diff =
      new Date(filter.end_date).getTime() -
      new Date(filter.start_date).getTime();

    const fifteenDays = 15 * 24 * 60 * 60 * 1000;

    if (diff <= fifteenDays) filter.live = true;
    else filter.dailyLive = true;

    return filter;

  }

  loadReport() {

    const filter = this.buildFilter();

    if (!filter.group.length) {
      this.toaster.info("Select at least one group");
      return;
    }

    this.reportService.getGeoSummaries(filter)
      .subscribe({

        next: (res: any) => {

          if (res.err) {
            this.toaster.error(res.msg);
            return;
          }

          this.allReportList = res.payload || [];

          this.totalReportCount =
            res.length?.[0]?.total || 0;

          const gross = res.grossGeoReport?.[0];

          this.reportGrossData = {

            click: gross?.click || 0,
            conversion: gross?.conv || 0,
            payout: gross?.payout || 0

          };

          this.calculateTotals();

        },

        error: () => {
          this.toaster.error("Something went wrong");
        }

      });

  }

  calculateTotals() {

    this.reportTotalSumData =
      this.allReportList.reduce(

        (acc, row) => {

          acc.click += row.click || 0;
          acc.conversion += row.conv || 0;
          acc.payout += row.payout || 0;

          return acc;

        },

        { click: 0, conversion: 0, payout: 0 }

      );
  }

  onFilter() {
    this.currentPage = 1;
    this.loadReport();
  }

  onReset() {
    this.selectedTimezone = "";
    this.currSelectedColumns =
      this.columnField.filter(x => x.selected);

    this.groupSelectedColumns =
      this.geoGroup.filter(x => x.selected);

    this.projSelectedColumns = [...this.currSelectedColumns];

    this.offerId = "";
    this.offerName = "";
    this.country = "";

    this.limit = 100;
    this.currentPage = 1;

    this.loadReport();
  }

  getPage(page: number) {

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { page },
      queryParamsHandling: 'merge'
    });

  }

  getDateTimeRangeData(dateTimeRange: any) {

    this.filterDate.startDateTime =
      dateTimeRange.startDateTime;

    this.filterDate.endDateTime =
      dateTimeRange.endDateTime;

    this.rangeOption =
      dateTimeRange.dateTimeRangeOption;
  }

  round(value: number) {

    if (value === null || value === undefined)
      return 0;

    return Number(parseFloat(value as any).toFixed(3));
  }

  getCR(click: number, conv: number): string {

    const c = Number(conv) || 0;
    const cl = Number(click) || 0;

    if (!cl) return '0.00';

    return ((c / cl) * 100).toFixed(2);

  }

  openExportModal(content: any) {

    this.exportSelectedColumns =
      [...this.currSelectedColumns];

    this.modal.open(content, {
      centered: true,
      backdrop: 'static'
    });

  }

  confirmExport(modal: any) {

    modal.close();

    this.generateCSV(this.allReportList);
  }

  cancelExport(modal: any) {

    modal.dismiss('cancel');

  }

  generateCSV(data: any[]) {

    const headers =
      this.exportSelectedColumns.map(x => x.field_name);

    const rows = data.map(r =>

      this.exportSelectedColumns.map(col => {

        const key = col.db_name;

        if (key === "cr")
          return this.getCR(r.click, r.conv);

        if (key === "conversion")
          return r.conv;

        return r[key] ?? "";

      })

    );

    const csv =
      [headers, ...rows]
        .map(e => e.join(","))
        .join("\n");

    const blob =
      new Blob([csv], { type: 'text/csv' });

    const url =
      window.URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download = "geo_report.csv";
    a.click();

  }

  compareDb = (a: any, b: any) => {
    return a && b && a.db_name === b.db_name;
  };
  trackByIndex(index: number) {
    return index;
  }



  // changeTimeZone(countryCode: string) {

  //   if (!countryCode) {
  //     this.timezoneList = [];
  //     this.selectedTimezone = null;
  //     return;
  //   }

  //   const timezones = countryTimezone.getTimezonesForCountry(countryCode);
  //   // console.log("timezones", timezones);
  //   this.timezoneList = timezones ? Object.values(timezones) : [];
  //   // console.log("this.timezoneList", this.timezoneList);
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