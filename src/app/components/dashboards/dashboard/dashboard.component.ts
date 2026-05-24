import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { FeatherModule } from 'angular-feather';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/services/dashboard.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxPermissionsService } from 'ngx-permissions';

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
    NgxPermissionsModule,
    RouterModule
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
  topCampaignsClicksLimit = 5;
  topAppIdsDateRange = 1;
  topCampaigndateRange = 1;
  topAppIdsData = [];
  topCampaignsData : any = [];
  dashboardData : any;
  userDashboardData : any;
  permissions : any;
  subtitle: string;
  ngAfterViewInit() { }


  progressCardsDateRange = 7;
  progressCardsData = {
    click: { 'previousValue': 0, 'currentValue': 0, 'percentValue': 0, 'bgcolor': this.colors['click'], 'color': '#ffffff' },
    conversion: { 'previousValue': 0, 'currentValue': 0, 'percentValue': 0, 'bgcolor': this.colors['conversion'], 'color': '#ffffff' },
    revenue: { 'previousValue': 0, 'currentValue': 0, 'percentValue': 0, 'bgcolor': this.colors['revenue'], 'color': '#ffffff' }
  }

  statChartDateRange = 1;
  // public statChartData: any = {
  //   series: [],
  //   chart: { fontFamily: 'Nunito Sans,sans-serif', height: 370, type: 'area', toolbar: { show: !1 } },
  //   dataLabels: { enabled: false },
  //   markers: { size: 1, strokeColors: "transparent" },
  //   stroke: { curve: 'smooth', width: '3', },
  //   colors: [this.colors['click'], this.colors['conversion'], this.colors['cr']],
  //   legend: { show: 1, position: 'bottom', horizontalAlign: 'center' },
  //   grid: { show: true, strokeDashArray: 3, borderColor: 'rgba(0,0,0,0.1)', xaxis: { lines: { show: true } }, yaxis: { lines: { show: true } } },
  //   fill: { type: 'gradient', gradient: { shade: 'light', type: "horizontal", shadeIntensity: 0.5, gradientToColors: undefined, inverseColors: true, opacityFrom: 0.5, opacityTo: 0.3, stops: [0, 50, 100] }, },
  //   xaxis: {

  //   },
  //   yaxis: [
  //       {
  //         seriesName: 'Click',
  //         min: 0,
  //         labels: { show: false },
  //       },
  //       {
  //         seriesName: 'Conversion',
  //         opposite: false,
  //         min: 0,
  //         max:100,
  //         labels: { show: false },
  //       },
  //       {
  //         tickAmount:5,
  //         seriesName: 'CR',
  //         opposite: true,
  //         title: { text: 'CR (0-1)' },
  //         min: 0,
  //         max: 1,
  //       },
  //     ],
  //   // yaxis: { type: 'category', categories: [], labels: { show: false, formatter: function (val) { return val.toFixed(2); } } },
  //   tooltip: { theme: 'dark', x: { show: false } }
  // };

  plotOptions: {
    bar: {
      columnWidth: '35%',
      borderRadius: 4
    }
  }
 statChartData: any = {
    series: [
      {
        name: 'Created Campaign',
        type: 'column',
        data: [50, 20, 30, 44, 22, 33, 21]
      },
      {
        name: 'Clicks',
        type: 'line',
        data: [550, 1000, 600, 800, 65, 90, 750]
      },
      {
        name: 'Provided Clicks',
        type: 'line',
        data: [35, 444, 55, 600, 60, 85, 900]
      }
    ],

    chart: {
      height: 370,
      type: 'line',

      toolbar: {
        show: true
      },

      zoom: {
        enabled: true
      }
    },

    plotOptions: {
      bar: {
        columnWidth: '35%',
        borderRadius: 5
      }
    },

    dataLabels: {
      enabled: false
    },

    stroke: {
      curve: 'smooth',
      width: [0, 3, 3]
    },

    fill: {
      opacity: [0.9, 1, 1]
    },

    colors: [
      '#f59e0b', // campaign
      '#2563eb', // clicks
      '#16a34a'  // provided clicks
    ],

    labels: [
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun'
    ],

    xaxis: {
      categories: [
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
        'Sun'
      ]
    },

    yaxis: [

      // Campaign axis
      {
        title: {
          text: 'Campaigns'
        },

        min: 0,
        max: 50
      },

      // Clicks axis
      {
        opposite: true,

        title: {
          text: 'Clicks'
        },

        min: 0,
        max: 1000
      }
    ],

    legend: {
      position: 'top',
      horizontalAlign: 'left'
    },

    tooltip: {
      shared: true,
      intersect: false
    },

    markers: {
      size: 4,
      hover: {
        size: 6
      }
    },

    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 4
    }
  };
  constructor(private router: Router, private toastrService: ToastrService, private dashboardService: DashboardService,
    private permissionsService: NgxPermissionsService
  ) { }

  ngOnInit(): void {    
    // this.getDashboardData();
    this.getStatisticsGraphData();
    this.permissions = this.permissionsService.getPermissions();
    this.permissionsService.permissions$.subscribe(perms => {
      this.permissions = perms;
      if(this.permissions?.['Admin']){
        this.getDashboardData();
        this.getTopClicksForUser('admin'); // remove in last after test.
      }else{
        this.getDashboardDataForUser();
        this.getTopClicksForUser('user');
      }
    });
  }

  getStatisticsGraphData() {

    const filter = {
      dateRange: 'week'
    };

    this.dashboardService
      .getStatisticsGraphData(filter)
      .subscribe({

        next: (res: any) => {

          console.log('res -> ', res);

          if (!res?.err && res?.payload) {

            const graphData = res.payload || [];

            const maxCampaigns = Math.max(
              ...graphData.map(
                (x: any) => x.createdCampaign || 0
              ),
              10
            );

            const maxClicks = Math.max(
              ...graphData.map(
                (x: any) => x.clicks || 0
              ),
              100
            );

            const maxProvidedClicks = Math.max(
              ...graphData.map(
                (x: any) => x.providedClicks || 0
              ),
              100
            );

            this.statChartData = {

              series: [

                {
                  name: 'Created Campaign',
                  type: 'column',
                  data: graphData.map(
                    (x: any) => x.createdCampaign || 0
                  )
                },

                {
                  name: 'Clicks',
                  type: 'line',
                  data: graphData.map(
                    (x: any) => x.clicks || 0
                  )
                },

                {
                  name: 'Provided Clicks',
                  type: 'line',
                  data: graphData.map(
                    (x: any) => x.providedClicks || 0
                  )
                }
              ],

              chart: {
                height: 370,
                type: 'line',

                toolbar: {
                  show: true
                },

                zoom: {
                  enabled: true
                }
              },

              plotOptions: {
                bar: {
                  columnWidth: '35%',
                  borderRadius: 4
                }
              },

              dataLabels: {
                enabled: false
              },

              stroke: {
                curve: 'smooth',
                width: [0, 3, 3]
              },

              fill: {
                opacity: [0.9, 1, 1]
              },

              colors: [
                '#f59e0b',
                '#2563eb',
                '#16a34a'
              ],

              xaxis: {

                categories: graphData.map(
                  (x: any) => x.day || ''
                ),

                title: {
                  text: 'Days'
                }
              },

              yaxis: [

                // Campaign Axis
                {
                  seriesName: 'Created Campaign',

                  title: {
                    text: 'Campaigns'
                  },

                  min: 0,

                  max: Math.ceil(maxCampaigns / 5) * 5,

                  tickAmount: 5
                },

                // Clicks Axis
                {
                  seriesName: 'Clicks',

                  opposite: true,

                  title: {
                    text: 'Clicks'
                  },

                  min: 0,

                  max: Math.ceil(maxClicks / 100) * 100,

                  tickAmount: 5
                },

                // Provided Clicks Axis
                {
                  seriesName: 'Provided Clicks',

                  opposite: true,

                  show: false,

                  min: 0,

                  max: Math.ceil(maxClicks / 100) * 100,

                  tickAmount: 5
                }
              ],

              legend: {
                position: 'top',
                horizontalAlign: 'left'
              },

              tooltip: {
                shared: true,
                intersect: false
              },

              markers: {
                size: 4,

                hover: {
                  size: 6
                }
              },

              grid: {
                borderColor: '#e5e7eb',
                strokeDashArray: 4
              }
            };
          }
        },

        error: (error: any) => {

          console.log(
            'getStatisticsGraphData error -> ',
            error
          );
        }
      });
  }




  getTopClicksForUser(role : any = "user"){
    let dateRange = this.generateDateRange(this.topCampaigndateRange);
    let filter = {
      key : 'hello Lakhan',
      dateRange,
      role,
      limit : this.topCampaignsClicksLimit
    }
    this.dashboardService.getTopClicksForUser(filter).subscribe({
      next : ( res : any ) => {
        // console.log(" getTopClicksForUser res -> ", res );
        this.topCampaignsData = res.payload;
      },
      error : ( error : any ) => {
        console.log(" getTopClicksForUser error -> ", error );
      }
    })
  }
  getDashboardDataForUser(){
    let filter = {
      dateRangeForAllStats: this.getDateRange(this.progressCardsDateRange),
      dateRangeForStatistics: this.getDateRange(this.statChartDateRange),
    }
    this.dashboardService.getDashboardDataForUser(filter).subscribe({
      next: (res: any) => {
        if (!res?.err && res?.payload) {
          this.userDashboardData = res.payload; 
        }
        else {
          this.toastrService.error('Unable to fetch dashboard data');
        }
      },
      error: (err : any ) => {
        console.error('Dashboard API Error:', err);
        this.toastrService.error('Unable to fetch dashboard data');
      }
    });
  }
  setLocalStorageDropdownOptions() {
    let dropdownOptions = JSON.stringify({
      "progressCardsDateRange": +this.progressCardsDateRange,
      "statChartDateRange": +this.statChartDateRange,
      // "topAppIdsLimit": +this.topAppIdsLimit,
      // "topAppIdsDateRange": +this.topAppIdsDateRange,
      "topCampaigndateRange" : +this.topCampaigndateRange,
    });
  }

  getDateRange( option : any ) {
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

  getDashboardDataForUserFilter(getProgressCardsData = true, getStatChartData = true, getTopAppIdsData = true) {

    let filter = {
      dateRangeForAllStats: this.getDateRange(this.progressCardsDateRange),
      dateRangeForStatistics: this.getDateRange(this.statChartDateRange),
      // dateRangeForAppIds: this.getDateRange(this.topAppIdsDateRange),
      // limitForAppIds: this.topAppIdsLimit,
      getAllStats: getProgressCardsData,
      getOverallStat: getStatChartData,
      getTopAppIdStat: getTopAppIdsData
    };
    console.log(" filter -> ", filter);
    this.dashboardService.getDashboardDataForUser(filter).subscribe({
      next: (res: any) => {
        if (!res?.err && res?.payload) {
          this.userDashboardData = res.payload;       
        }
        else {
          this.toastrService.error('Unable to fetch dashboard data');
        }
      },
      error: (err) => {
        console.error('Dashboard API Error:', err);
        this.toastrService.error('Unable to fetch dashboard data');
      }
    });     
  }

  getDashboardData(getProgressCardsData = true, getStatChartData = true, getTopAppIdsData = true) {

    let filter = {
      dateRangeForAllStats: this.getDateRange(this.progressCardsDateRange),
      dateRangeForStatistics: this.getDateRange(this.statChartDateRange),
      dateRangeForAppIds: this.getDateRange(this.topAppIdsDateRange),
      // limitForAppIds: this.topAppIdsLimit,
      getAllStats: getProgressCardsData,
      getOverallStat: getStatChartData,
      getTopAppIdStat: getTopAppIdsData
    };
    console.log(" filter -> ", filter);
    this.dashboardService.getDashboardData(filter).subscribe({
      next: (res: any) => {
        console.log(" dashboard api response -> ", res);
        if (!res?.err && res?.payload) {
          this.dashboardData = res.payload;           
        }
        else {
          this.toastrService.error('Unable to fetch dashboard data');
        }
      },
      error: (err) => {
        console.error('Dashboard API Error:', err);
        this.toastrService.error('Unable to fetch dashboard data');
      }
    });     
  }

  calculatePercentage1(current: any, previous: any): number {
    const currentValue = parseFloat(current) || 0;
    const previousValue = parseFloat(previous) || 0;
    // Avoid divide by zero
    if (previousValue === 0) {
      return currentValue > 0 ? 100.0 : 0.0;
    }
    const percentage = ((currentValue - previousValue) / previousValue) * 100;
    // return as number rounded to 1 decimal
    return Math.round(percentage * 10) / 10;
  }

  calculatePercentageForUser(current: any, previous: any): number {
    const currentValue = parseFloat(current) || 0;
    const previousValue = parseFloat(previous) || 0;
    // Avoid divide by zero
    if (previousValue === 0) {
      return currentValue > 0 ? 100 : 0;
    }

    const percentage =
      ((currentValue - previousValue) / previousValue) * 100;

    // Limit between 0 and 100
    return Math.min(Math.max(Math.round(percentage * 10) / 10, 0), 100);
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

  getProgressWidth(current: any, previous: any): number {
    const percentage = Math.abs(this.calculatePercentage1(current, previous));
    return percentage > 100 ? 100 : percentage;
  }
  getProgressWidthForUser(current: any, previous: any): number {
    const percentage = Math.abs(this.calculatePercentageForUser(current, previous));
    return percentage > 100 ? 100 : percentage;
  }
  onChange( value : any ) {
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
    } else if (value == "topCampaignClicks") {
      if (this.topAppIdsDateRange == 0) {
        this.toastrService.info('Please select valid date range!');
        return;
      }
      // if (this.topAppIdsLimit == 0) {
      //   this.toastrService.info('Please select valid limit!');
      //   return;
      // }
      console.log(" >>>>>>>>>>>>>>>>>>>>>>>>>>>> ");
      console.log(" this.limit ", this.topCampaignsClicksLimit, " date -> " , this.topCampaigndateRange)
      getTopAppIdsData = true;
    }

    // console.log(" dashboard time ");
    // console.log("getProgressCardsData -> ", getProgressCardsData);
    // console.log("getStatChartData -> ", getStatChartData);
    // console.log("getTopAppIdsData -> ", getTopAppIdsData);

    if(this.permissions?.['Admin']){
      console.log(" Admin user -> getDashboardData ");
      this.getDashboardData(getProgressCardsData, getStatChartData, getTopAppIdsData);
      this.getTopClicksForUser('admin'); // remove in last after test 
    }else{
      console.log(" Non Admin user -> getDashboardDataForUser ");
      this.getDashboardDataForUserFilter(getProgressCardsData, getStatChartData, getTopAppIdsData);
      this.getTopClicksForUser('user');
    }
    // this.getDashboardData(getProgressCardsData, getStatChartData, getTopAppIdsData);
    this.setLocalStorageDropdownOptions();
  }

  // generateDateRange(n: number) {
  //   const now = new Date();
  //   let startDate: any;
  //   let endDate: any;
  //   const formatDate = (date: Date, time: string) => {
  //     return ( date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + time );
  //   };

  //   // Today
  //   if (n === 1) {
  //     startDate = formatDate(now, "T00:00");
  //     endDate = formatDate(now, "T23:59");
  //   }
  //   // Yesterday
  //   else if (n === 2) {
  //     const yesterday = new Date();
  //     yesterday.setDate(yesterday.getDate() - 1);
  //     startDate = formatDate(yesterday, "T00:00");
  //     endDate = formatDate(yesterday, "T23:59");
  //   }
  //   // This Week
  //   else if (n === 3) {
  //     const firstDay = new Date();
  //     firstDay.setDate(firstDay.getDate() - firstDay.getDay());
  //     startDate = formatDate(firstDay, "T00:00");
  //     endDate = formatDate(now, "T23:59");
  //   }
  //   // Last Week
  //   else if (n === 4) {
  //     const firstDay = new Date();
  //     firstDay.setDate(firstDay.getDate() - firstDay.getDay() - 7);
  //     const lastDay = new Date();
  //     lastDay.setDate(lastDay.getDate() - lastDay.getDay() - 1);
  //     startDate = formatDate(firstDay, "T00:00");
  //     endDate = formatDate(lastDay, "T23:59");
  //   }

  //   // This Month
  //   else if (n === 5) {
  //     const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  //     startDate = formatDate(firstDay, "T00:00");
  //     endDate = formatDate(now, "T23:59");
  //   }

  //   // Last Month
  //   else if (n === 6) {
  //     const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  //     const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
  //     startDate = formatDate(firstDay, "T00:00");
  //     endDate = formatDate(lastDay, "T23:59");
  //   }
  //   return { startDate, endDate };
  // }

  generateDateRange( n : any ) {
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

  onClickAppId( appId : string ) {

  }
}
