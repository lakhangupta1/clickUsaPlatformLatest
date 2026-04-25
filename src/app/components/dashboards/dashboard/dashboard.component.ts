import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { FeatherModule } from 'angular-feather';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/services/dashboard.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [
    NgApexchartsModule,
    FeatherModule,
    NgScrollbarModule,
    FormsModule,
    CommonModule,
    NgbProgressbarModule,
  ],
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit, OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  colors = {
    click: '#013f97ff',
    conversion: '#3ee6a8',
    revenue: '#e8adad',
    cr: '#575b5e'
  };

  progressCards: any;
  topAppIdsLimit = 5;
  topAppIdsDateRange = 1;
  topAppIdsData = [];


  subtitle: string;
  ngAfterViewInit() { }


  progressCardsDateRange = 7;
  progressCardsData = {
    click: { 'previousValue': 0, 'currentValue': 0, 'percentValue': 0, 'bgcolor': this.colors['click'], 'color': '#ffffff' },
    conversion: { 'previousValue': 0, 'currentValue': 0, 'percentValue': 0, 'bgcolor': this.colors['conversion'], 'color': '#ffffff' },
    revenue: { 'previousValue': 0, 'currentValue': 0, 'percentValue': 0, 'bgcolor': this.colors['revenue'], 'color': '#ffffff' }
  }

  statChartDateRange = 1;
  public statChartData: any = {
    series: [],
    chart: { fontFamily: 'Nunito Sans,sans-serif', height: 370, type: 'area', toolbar: { show: !1 } },
    dataLabels: { enabled: false },
    markers: { size: 1, strokeColors: "transparent" },
    stroke: { curve: 'smooth', width: '3', },
    colors: [this.colors['click'], this.colors['conversion'], this.colors['cr']],
    legend: { show: 1, position: 'bottom', horizontalAlign: 'center' },
    grid: { show: true, strokeDashArray: 3, borderColor: 'rgba(0,0,0,0.1)', xaxis: { lines: { show: true } }, yaxis: { lines: { show: true } } },
    fill: { type: 'gradient', gradient: { shade: 'light', type: "horizontal", shadeIntensity: 0.5, gradientToColors: undefined, inverseColors: true, opacityFrom: 0.5, opacityTo: 0.3, stops: [0, 50, 100] }, },
    xaxis: {

    },
    yaxis: [
        {
          seriesName: 'Click',
          min: 0,
          labels: { show: false },
        },
        {
          seriesName: 'Conversion',
          opposite: false,
          min: 0,
          max:100,
          labels: { show: false },
        },
        {
          tickAmount:5,
          seriesName: 'CR',
          opposite: true,
          title: { text: 'CR (0-1)' },
          min: 0,
          max: 1,
        },
      ],
    // yaxis: { type: 'category', categories: [], labels: { show: false, formatter: function (val) { return val.toFixed(2); } } },
    tooltip: { theme: 'dark', x: { show: false } }
  };

  constructor(private router: Router, private toastrService: ToastrService, private dashboardService: DashboardService) { }

  ngOnInit(): void {
    // this.getLocalStorageDropdownOptions();
    this.getDashboardData();
  }

  setLocalStorageDropdownOptions() {
    let dropdownOptions = JSON.stringify({
      "progressCardsDateRange": +this.progressCardsDateRange,
      "statChartDateRange": +this.statChartDateRange,
      "topAppIdsLimit": +this.topAppIdsLimit,
      "topAppIdsDateRange": +this.topAppIdsDateRange
    });

    // localStorage.setItem("publisher_dashboard_dropdown_options", dropdownOptions);
  }

  // getLocalStorageDropdownOptions() {
  //   let dropdownOptions = JSON.parse(localStorage.getItem("publisher_dashboard_dropdown_options"));
  //   if (dropdownOptions) {
  //     if (dropdownOptions['progressCardsDateRange']) {
  //       this.progressCardsDateRange = +dropdownOptions['progressCardsDateRange'];
  //     }
  //     if (dropdownOptions['statChartDateRange']) {
  //       this.statChartDateRange = +dropdownOptions['statChartDateRange'];
  //     }
  //     if (dropdownOptions['topAppIdsLimit']) {
  //       this.topAppIdsLimit = +dropdownOptions['topAppIdsLimit'];
  //     }
  //     if (dropdownOptions['topAppIdsDateRange']) {
  //       this.topAppIdsDateRange = +dropdownOptions['topAppIdsDateRange'];
  //     }
  //   }
  // }

  getDateRange(option) {
    if (option == '1') {
      return "today";
    } else if (option == '2') {
      return "yesterday";
    } else if (option == '3') {
      return "this_week";
    } else if (option == '4') {
      return "last_week";
    } else if (option == '5') {
      return "this_month";
    } else if (option == '6') {
      return "last_month";
    } else if (option == '7') {
      return "today/yesterday";
    } else if (option == '8') {
      return "last_7_days/7_days_before_last_7_days";
    } else if (option == '9') {
      return "this_month/last_month";
    }
    return null;
  }

  getDashboardData(getProgressCardsData = true, getStatChartData = true, getTopAppIdsData = true) {

    let filter = {
      dateRangeForAllStats: this.getDateRange(this.progressCardsDateRange),
      dateRangeForStatistics: this.getDateRange(this.statChartDateRange),
      dateRangeForAppIds: this.getDateRange(this.topAppIdsDateRange),
      limitForAppIds: this.topAppIdsLimit,
      getAllStats: getProgressCardsData,
      getOverallStat: getStatChartData,
      getTopAppIdStat: getTopAppIdsData
    };
    // this.dashboardService.getPublisherDashboardData(filter).subscribe(data => {
    //   // console.log("getPublisherDashboardData-->", data);
    //   if (data['err']) {
    //     this.toastrService.error(data['msg'], 'Error!');
    //   } else {
    //     if (data['payload']['allStatsForCurrentDateRange']) {
    //       if (data['payload']['allStatsForCurrentDateRange']['click']) {
    //         this.progressCardsData['click']['currentValue'] = Number(data['payload']['allStatsForCurrentDateRange']['click']);
    //       }
    //       if (data['payload']['allStatsForCurrentDateRange']['conversion']) {
    //         this.progressCardsData['conversion']['currentValue'] = Number(data['payload']['allStatsForCurrentDateRange']['conversion']);
    //       }
    //       if (data['payload']['allStatsForCurrentDateRange']['payout']) {
    //         this.progressCardsData['revenue']['currentValue'] = Number(data['payload']['allStatsForCurrentDateRange']['payout'].toFixed(2));
    //       }
    //     }
    //     if (data['payload']['allStatsForPreviousDateRange']) {
    //       if (data['payload']['allStatsForPreviousDateRange']['click']) {
    //         this.progressCardsData['click']['previousValue'] = Number(data['payload']['allStatsForPreviousDateRange']['click']);
    //       }
    //       if (data['payload']['allStatsForPreviousDateRange']['conversion']) {
    //         this.progressCardsData['conversion']['previousValue'] = Number(data['payload']['allStatsForPreviousDateRange']['conversion']);
    //       }
    //       if (data['payload']['allStatsForPreviousDateRange']['payout']) {
    //         this.progressCardsData['revenue']['previousValue'] = Number(data['payload']['allStatsForPreviousDateRange']['payout'].toFixed(2));
    //       }
    //     }
    //     this.progressCardsData['click']['percentValue'] = this.calculatePercentage(this.progressCardsData['click']['previousValue'], this.progressCardsData['click']['currentValue']);
    //     this.progressCardsData['conversion']['percentValue'] = this.calculatePercentage(this.progressCardsData['conversion']['previousValue'], this.progressCardsData['conversion']['currentValue']);
    //     this.progressCardsData['revenue']['percentValue'] = this.calculatePercentage(this.progressCardsData['revenue']['previousValue'], this.progressCardsData['revenue']['currentValue']);

    //     if (data['payload']['overallStat']) {
    //       let series = [{ name: 'Click', data: [] }, { name: 'Conversion', data: [] }, { name: 'CR', data: [] }];
    //       let xaxis = { type: 'category', categories: [], labels: { show: false } };
    //       for (let item of data['payload']['overallStat']) {
    //         series[0]['data'].push(item['click']);

    //         series[1]['data'].push(item['conversion']);

    //         let cr = 0;
    //         if (item['click'] && item['conversion']) {
    //           cr = Number(((item['conversion'] / item['click']) * 100).toFixed(2));
    //         }

    //         series[2]['data'].push(cr);

    //         if (item['_id'] && item['_id']['hour'] >= 0) {
    //           xaxis['categories'].push('Time: ' + item['_id']['hour']);
    //         } else if (item['_id'] && item['_id']['day'] && item['_id']['month'] && item['_id']['year']) {
    //           xaxis['categories'].push('Date: ' + item['_id']['day'] + '/' + item['_id']['month'] + '/' + item['_id']['year']);
    //         }
    //       }
    //       this.statChartData['xaxis'] = xaxis;
    //       this.statChartData['series'] = series;

    //     }
    //     if (data['payload']['appIds']) {
    //       this.topAppIdsData = data['payload']['appIds'];
    //     }
    //   }
    // }, () => {
    //   this.toastrService.error('Something went wrong, Try again.', 'Error!');
    // });
  }

  calculatePercentage(dividend: number, divisor: number) {
    if (dividend == 0 && divisor == 0) {
      return 0;
    } else if (dividend == 0 || divisor == 0) {
      return 100;
    } else {
      let temp: number;
      if (dividend > divisor) {
        temp = divisor;
        divisor = dividend;
        dividend = temp;
      }
      return ((divisor - dividend) / divisor) * 100;
    }
  }

  onChange(value) {
    let getProgressCardsData = false;
    let getStatChartData = false;
    let getTopAppIdsData = false;

    if (value == "progressCards") {
      if (this.progressCardsDateRange == 0) {
        this.toastrService.info('Please select valid date range!');
        return;
      }
      getProgressCardsData = true;
    } else if (value == "statChart") {
      if (this.statChartDateRange == 0) {
        this.toastrService.info('Please select valid date range!');
        return;
      }
      getStatChartData = true;
    } else if (value == "topAppIds") {
      if (this.topAppIdsDateRange == 0) {
        this.toastrService.info('Please select valid date range!');
        return;
      }
      if (this.topAppIdsLimit == 0) {
        this.toastrService.info('Please select valid limit!');
        return;
      }
      getTopAppIdsData = true;
    }

    this.getDashboardData(getProgressCardsData, getStatChartData, getTopAppIdsData);
    this.setLocalStorageDropdownOptions();
  }

  generateDateRange(n) {
    let now = new Date();
    let startDate = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2) + "T00:00";
    let endDate = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2) + "T23:59";
    if (n == 2) {
      now.setDate(now.getDate() - 1);
      startDate = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2) + "T00:00";
      endDate = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2) + "T23:59";
    } else if (n == 3) {
      let first = new Date();
      let firstDay = new Date(first.setDate(first.getDate() - first.getDay()));
      startDate = firstDay.getFullYear() + "-" + ("0" + (firstDay.getMonth() + 1)).slice(-2) + "-" + ("0" + firstDay.getDate()).slice(-2) + "T00:00";
      endDate = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2) + "T23:59";
    } else if (n == 4) {
      let last = new Date();
      let firstDay = new Date(now.setDate(now.getDate() - now.getDay() - 7));
      let endDay = new Date(last.setDate(last.getDate() - last.getDay()));
      startDate = firstDay.getFullYear() + "-" + ("0" + (firstDay.getMonth() + 1)).slice(-2) + "-" + ("0" + firstDay.getDate()).slice(-2) + "T00:00";
      endDate = endDay.getFullYear() + "-" + ("0" + (endDay.getMonth() + 1)).slice(-2) + "-" + ("0" + endDay.getDate()).slice(-2) + "T23:59";
    } else if (n == 5) {
      let firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate = firstDay.getFullYear() + "-" + ("0" + (firstDay.getMonth() + 1)).slice(-2) + "-" + ("0" + firstDay.getDate()).slice(-2) + "T00:00";
      endDate = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2) + "T23:59";
    } else if (n == 6) {
      let firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      let lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
      startDate = firstDay.getFullYear() + "-" + ("0" + (firstDay.getMonth() + 1)).slice(-2) + "-" + ("0" + firstDay.getDate()).slice(-2) + "T00:00";
      endDate = lastDay.getFullYear() + "-" + ("0" + (lastDay.getMonth() + 1)).slice(-2) + "-" + ("0" + lastDay.getDate()).slice(-2) + "T23:59";
    }
    return { "startDate": startDate, "endDate": endDate };
  }

  onClickAppId(appId) {
  }


}
