import { Component, OnInit, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexPlotOptions, ApexResponsive, ApexStates, ApexTheme, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type totalrevenueChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  yaxis: ApexYAxis | any;
  stroke: any;
  theme: ApexTheme | any;
  tooltip: ApexTooltip | any;
  dataLabels: ApexDataLabels | any;
  legend: ApexLegend | any;
  colors: string[] | any;
  markers: any;
  grid: ApexGrid | any;
  fill: ApexFill | any;
  responsive: ApexResponsive | any;
  plotOptions: ApexPlotOptions | any;
  states: ApexStates | any;
};

export type pieChartOptions = {
  series: number[];
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  legend: ApexLegend;
  colors: string[];
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-modarn',
  standalone: true,
  imports: [NgApexchartsModule, NgxChartsModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './modarn.component.html',
  styleUrl: './modarn.component.scss'
})
export class ModarnComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  progressCardsDateRange = 7;
  statChartDateRange = 1;
  topAppIdsLimit = 5;
  topAppIdsDateRange = 1;
  topAppIdsData = [];

  colors = {
    click: '#466eaa',
    conversion: '#FFC148', //#FFC148
    revenue: '#198754',
    cr: '#f50505ff'
  };


  public statChartData: Partial<totalrevenueChartOptions> = {
    series: [],
    chart: {
      fontFamily: "inherit",
      type: "bar",
      height: 306,
      stacked: false,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
    },
    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
    },
    colors: [this.colors['click'], this.colors['conversion'], this.colors['cr']],
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        borderRadius: 8,
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      categories: [],
      labels: {
        style: {
          colors: "#a1aab2",
        },
      },
    },
    yaxis: [

      { seriesName: "Click", tickAmount: 5, title: { text: "Click" }, labels: { show: true, style: { colors: "#f50505" } }, },
      { seriesName: "Conversion", tickAmount: 5, labels: { show: false, style: { colors: "#f50505" } } },
      {
        seriesName: "CR",
        opposite: true,
        min: 0,
        max: 1,
        tickAmount: 5,
        title: { text: "CR (0–1)" },
        labels: { style: { colors: "#f50505" } },
      }
    ],

    tooltip: {
      theme: "dark",
      shared: true,
      intersect: false,
      y: {
        formatter: (value: any, { seriesIndex, dataPointIndex, w }) => {
          const seriesName = w.config.series[seriesIndex].name;
          return `: ${Number(value)}`;
        }
      }
    },
    legend: {
      show: true,
    },
    fill: {
      opacity: 1,
    },
  };

  // public topAppPieChart: Partial<pieChartOptions> = {
  //   series: [],
  //   chart: {
  //     type: "donut",
  //     height: 350
  //   },
  //   labels: [],
  //   legend: {
  //     position: "right"
  //   },
  //   dataLabels: {
  //     enabled: true,
     
  //     style: {
  //       fontSize: '14px',
  //       fontWeight: '600',
  //       colors: ['#ffffff']
  //     }
  //   },
  //   colors: [
  //     "#466eaa",
  //     "#FFC148",
  //     "#198754",
  //     "#f50505",
  //     "#00c8ff"
  //   ],

  //   responsive: [
  //     {
  //       breakpoint: 480,
  //       options: {
  //         chart: {
  //           width: 300
  //         },
  //         legend: {
  //           position: "bottom"
  //         }
  //       }
  //     }
  //   ]
  // };

  progressCardsData = {
    click: { 'previousValue': 0, 'currentValue': 0, 'percentValue': 0, 'bgcolor': this.colors['click'], 'color': '#ffffff' ,icon: 'fas fa-mouse-pointer'},
    conversion: { 'previousValue': 0, 'currentValue': 0, 'percentValue': 0, 'bgcolor': this.colors['conversion'], 'color': '#ffffff' ,icon: 'fas fa-exchange-alt'},
    revenue: { 'previousValue': 0, 'currentValue': 0, 'percentValue': 0, 'bgcolor': this.colors['revenue'], 'color': '#ffffff',icon: 'fas fa-dollar-sign' },
  }

  constructor(private router: Router,
    private toastrService: ToastrService,
    private dashboardService: DashboardService) {

  }

  ngOnInit(): void {
    this.getLocalStorageDropdownOptions();
    this.getDashboardData();
  }

  setLocalStorageDropdownOptions() {
    let dropdownOptions = JSON.stringify({
      "progressCardsDateRange": +this.progressCardsDateRange,
      "statChartDateRange": +this.statChartDateRange,
      "topAppIdsLimit": +this.topAppIdsLimit,
      "topAppIdsDateRange": +this.topAppIdsDateRange
    });

    localStorage.setItem("publisher_dashboard_dropdown_options", dropdownOptions);
  }

  getLocalStorageDropdownOptions() {
    let dropdownOptions = JSON.parse(localStorage.getItem("publisher_dashboard_dropdown_options"));
    if (dropdownOptions) {
      if (dropdownOptions['progressCardsDateRange']) {
        this.progressCardsDateRange = +dropdownOptions['progressCardsDateRange'];
      }
      if (dropdownOptions['statChartDateRange']) {
        this.statChartDateRange = +dropdownOptions['statChartDateRange'];
      }
      if (dropdownOptions['topAppIdsLimit']) {
        this.topAppIdsLimit = +dropdownOptions['topAppIdsLimit'];
      }
      if (dropdownOptions['topAppIdsDateRange']) {
        this.topAppIdsDateRange = +dropdownOptions['topAppIdsDateRange'];
      }
    }
  }

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
    this.dashboardService.getPublisherDashboardData(filter).subscribe(data => {
      // console.log("getPublisherDashboardData-->", data);
      if (data['err']) {
        this.toastrService.error(data['msg'], 'Error!');
      } else {
        if (data['payload']['allStatsForCurrentDateRange']) {
          if (data['payload']['allStatsForCurrentDateRange']['click']) {
            this.progressCardsData['click']['currentValue'] = Number(data['payload']['allStatsForCurrentDateRange']['click']);
          }
          if (data['payload']['allStatsForCurrentDateRange']['conversion']) {
            this.progressCardsData['conversion']['currentValue'] = Number(data['payload']['allStatsForCurrentDateRange']['conversion']);
          }
          if (data['payload']['allStatsForCurrentDateRange']['payout']) {
            this.progressCardsData['revenue']['currentValue'] = Number(data['payload']['allStatsForCurrentDateRange']['payout'].toFixed(3));
          }

        }
        if (data['payload']['allStatsForPreviousDateRange']) {
          if (data['payload']['allStatsForPreviousDateRange']['click']) {
            this.progressCardsData['click']['previousValue'] = Number(data['payload']['allStatsForPreviousDateRange']['click']);
          }
          if (data['payload']['allStatsForPreviousDateRange']['conversion']) {
            this.progressCardsData['conversion']['previousValue'] = Number(data['payload']['allStatsForPreviousDateRange']['conversion']);
          }
          if (data['payload']['allStatsForPreviousDateRange']['payout']) {
            this.progressCardsData['revenue']['previousValue'] = Number(data['payload']['allStatsForPreviousDateRange']['payout'].toFixed(3));
          }
        }
        this.progressCardsData['click']['percentValue'] = this.calculatePercentage(this.progressCardsData['click']['previousValue'], this.progressCardsData['click']['currentValue']);
        this.progressCardsData['conversion']['percentValue'] = this.calculatePercentage(this.progressCardsData['conversion']['previousValue'], this.progressCardsData['conversion']['currentValue']);
        this.progressCardsData['revenue']['percentValue'] = this.calculatePercentage(this.progressCardsData['revenue']['previousValue'], this.progressCardsData['revenue']['currentValue']);

        if (data['payload']['overallStat']) {
          let series = [{ name: 'Click', data: [] }, { name: 'Conversion', data: [] }, { name: 'CR', data: [] }];
          let xaxis = { type: 'category', categories: [], labels: { show: false } };
          for (let item of data['payload']['overallStat']) {
            series[0]['data'].push(item['click'] || 0);

            series[1]['data'].push(item['conversion'] || 0).toFixed(2);

            let cr = 0;
            if (item['click'] && item['conversion']) {
              cr = Number(((item['conversion'] / item['click']) * 100).toFixed(2));
            }

            series[2]['data'].push(cr);
            // console.log("cr", cr);
            if (item['_id'] && item['_id']['hour'] >= 0) {
              xaxis['categories'].push('Time: ' + item['_id']['hour']);
            } else if (item['_id'] && item['_id']['day'] && item['_id']['month'] && item['_id']['year']) {
              xaxis['categories'].push('Date: ' + item['_id']['day'] + '/' + item['_id']['month'] + '/' + item['_id']['year']);
            }
          }
          this.statChartData.xaxis = xaxis;
          this.statChartData.series = series;
        }
        if (data['payload']['appIds']) {
          this.topAppIdsData = data['payload']['appIds'];
          // console.log("topAppIdsData - 3", this.topAppIdsData);
          // let labels = [];
          // let series = [];

          // for (let item of this.topAppIdsData) {
          //   // labels.push(item.offer_name);  
          //   labels.push(item.offer_name.substring(0, 10));
          //   series.push(item.conversion);
          // }

          // this.topAppPieChart.labels = labels;
          // this.topAppPieChart.series = series;

          // console.log("Pie chart data", this.topAppPieChart);

        }
      }
    }, () => {
      this.toastrService.error('Something went wrong, Try again.', 'Error!');
    });
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


}
