import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexMarkers, ApexStroke, ApexTitleSubtitle, ApexXAxis, ApexYAxis, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/services/dashboard.service';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: Array<{
    title?: {
      text?: string;
      style?: {
        color?: string;
      };
    };
    labels?: {
      formatter?: (val: number) => string;
      style?: {
        colors?: string;
      };
      show?: boolean;
    };
    opposite?: boolean;
    min?: number;
    max?: number;
    tickAmount?: number;
  }>;
  title: ApexTitleSubtitle;
  markers: ApexMarkers;
  colors: string[];
  fill: {
    opacity: number[];
  };
  forecastDataPoints: {
    count: number;
    dashArray: number;
  };
  legend: {
    show: boolean;
    customLegendItems: string[];
    inverseOrder: boolean;
  };
};
@Component({
  selector: 'app-vantadashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './vantadashboard.component.html',
  styleUrl: './vantadashboard.component.scss'
})
export class VantadashboardComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  progressCardsDateRange = 7;
  statChartDateRange = 1;
  topAppIdsLimit = 5;
  topAppIdsDateRange = 1;
  topAppIdsData = [];


  colors1 = {
    click: 'linear-gradient(45deg, #0301a1, #4a47d5)',
    conversion: 'linear-gradient(45deg, #048b75ff, #019483ff)',
    revenue: 'linear-gradient(45deg, #770377ff, #700274ff)',
    cr: 'linear-gradient(45deg, #cf3d2aff, #f0d14e)'
  };
// graph color
  colors = {
    click: '#710580ff',
    conversion: '#66c0b1',
    revenue: '#a10399ff',
    cr: '#cf3d2a'
  };

  progressCardsData = {
    click: { previousValue: 0, currentValue: 0, percentValue: 0, bgcolor: this.colors1.click, color: "#f031f0" },
    conversion: { previousValue: 0, currentValue: 0, percentValue: 0, bgcolor: this.colors1.conversion, color: "#f031f0" },
    revenue: { previousValue: 0, currentValue: 0, percentValue: 0, bgcolor: this.colors1.revenue, color: "#f031f0" },
  };

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private dashboardService: DashboardService
  ) {


    this.chartOptions = {
      series: [
        { name: 'Click', data: [],type: 'column' },
        { name: 'Conversion', data: [],type:'area' },
        { name: 'CR (0-1)', data: [] ,type: 'line'}
      ],
      chart: {
        height: 350,
        type: "line",
        stacked:false,
        animations: {
          speed: 500
        },
        toolbar: {
          show: false
        }
      },
      colors: [this.colors.click, this.colors.conversion, this.colors.cr], dataLabels: {
        enabled: false
      },
      fill: {
        opacity: [1, 1, 1]
      },
      stroke: {
        curve: "smooth",
        width: 4
      },
      xaxis: {
        type: 'category',
        categories: [],    
        labels: {
          show: true,
          style: { colors: '#a1aab2' }
        },
        axisTicks: { show: true },
        axisBorder: { show: true }
      },
      yaxis: [{
        title: {
          style: {
            color: this.colors.click
          }
        },
        labels: {
          show: false,
          style: {
            colors: this.colors.click
          }
        }
      },
      {
        title: {
          style: {
            color: this.colors.conversion,
          }
        },
        opposite: true,
        labels: {
          show: false, style: {
            colors: this.colors.conversion
          }
        }
      },
      {
        title: {
          text: "CR (0-1)",
          style: {
            color: this.colors.cr
          }
        },
        opposite: true,
        min: 0,
        max: 1,
        tickAmount: 5,
        labels: {
          formatter: function (val) {
            return val.toFixed(1);
          },
          style: {
            colors: this.colors.cr
          }
        }
      }],
      legend: {
        show: true,
        customLegendItems: ["Click", "Conversion", "CR"],
        inverseOrder: false
      },

      markers: {
        hover: {
          sizeOffset: 5
        }
      }
    };
  }

  ngOnInit(): void {
    this.getLocalStorageDropdownOptions();
    this.getDashboardData();
  }

  setLocalStorageDropdownOptions() {
    const dropdownOptions = JSON.stringify({
      progressCardsDateRange: +this.progressCardsDateRange,
      statChartDateRange: +this.statChartDateRange,
      topAppIdsLimit: +this.topAppIdsLimit,
      topAppIdsDateRange: +this.topAppIdsDateRange
    });
    localStorage.setItem('publisher_dashboard_dropdown_options', dropdownOptions);
  }

  getLocalStorageDropdownOptions() {
    const dropdownOptions = JSON.parse(localStorage.getItem('publisher_dashboard_dropdown_options'));
    if (dropdownOptions) {
      if (dropdownOptions['progressCardsDateRange']) this.progressCardsDateRange = +dropdownOptions['progressCardsDateRange'];
      if (dropdownOptions['statChartDateRange']) this.statChartDateRange = +dropdownOptions['statChartDateRange'];
      if (dropdownOptions['topAppIdsLimit']) this.topAppIdsLimit = +dropdownOptions['topAppIdsLimit'];
      if (dropdownOptions['topAppIdsDateRange']) this.topAppIdsDateRange = +dropdownOptions['topAppIdsDateRange'];
    }
  }

  getDateRange(option: number) {
    switch (+option) {
      case 1: return 'today';
      case 2: return 'yesterday';
      case 3: return 'this_week';
      case 4: return 'last_week';
      case 5: return 'this_month';
      case 6: return 'last_month';
      case 7: return 'today/yesterday';
      case 8: return 'last_7_days/7_days_before_last_7_days';
      case 9: return 'this_month/last_month';
    }
    return null;
  }

  getDashboardData(getProgressCardsData = true, getStatChartData = true, getTopAppIdsData = true) {
    const filter = {
      dateRangeForAllStats: this.getDateRange(this.progressCardsDateRange),
      dateRangeForStatistics: this.getDateRange(this.statChartDateRange),
      dateRangeForAppIds: this.getDateRange(this.topAppIdsDateRange),
      limitForAppIds: this.topAppIdsLimit,
      getAllStats: getProgressCardsData,
      getOverallStat: getStatChartData,
      getTopAppIdStat: getTopAppIdsData
    };

    this.dashboardService.getPublisherDashboardData(filter).subscribe(data => {
      if (data['err']) {
        this.toastrService.error(data['msg'], 'Error!');
      } else {
        if (data['payload']['allStatsForCurrentDateRange']) {
          this.progressCardsData['click']['currentValue'] = Number(data['payload']['allStatsForCurrentDateRange']['click'] || 0);
          this.progressCardsData['conversion']['currentValue'] = Number(data['payload']['allStatsForCurrentDateRange']['conversion'] || 0);
          this.progressCardsData['revenue']['currentValue'] = Number((data['payload']['allStatsForCurrentDateRange']['payout'] || 0).toFixed(3));
        }
        if (data['payload']['allStatsForPreviousDateRange']) {
          this.progressCardsData['click']['previousValue'] = Number(data['payload']['allStatsForPreviousDateRange']['click'] || 0);
          this.progressCardsData['conversion']['previousValue'] = Number(data['payload']['allStatsForPreviousDateRange']['conversion'] || 0);
          this.progressCardsData['revenue']['previousValue'] = Number((data['payload']['allStatsForPreviousDateRange']['payout'] || 0).toFixed(3));
        }

        this.progressCardsData['click']['percentValue'] =
          this.calculatePercentage(this.progressCardsData['click']['previousValue'], this.progressCardsData['click']['currentValue']);
        this.progressCardsData['conversion']['percentValue'] =
          this.calculatePercentage(this.progressCardsData['conversion']['previousValue'], this.progressCardsData['conversion']['currentValue']);
        this.progressCardsData['revenue']['percentValue'] =
          this.calculatePercentage(this.progressCardsData['revenue']['previousValue'], this.progressCardsData['revenue']['currentValue']);

        if (data['payload']['overallStat']) {
          const series = [
            { name: 'Click', data: [],type: 'column' },
            { name: 'Conversion', data: [],type: 'area' },
            { name: 'CR (0-1)', data: [],type: 'line' }
          ];
          const categories = [];

          for (const item of data['payload']['overallStat']) {
            series[0].data.push(Number(item['click'] || 0));
            series[1].data.push(Number(item['conversion'] || 0));

            let cr = 0;
            if (item['click'] && item['conversion']) {
              cr = Number((item['conversion'] / item['click'] * 100).toFixed(2));
            }
            series[2].data.push(Number(cr));

            if (item['_id']?.hour >= 0) {
              categories.push('Time: ' + item['_id']['hour']);
            } else if (item['_id']?.day && item['_id']?.month && item['_id']?.year) {
              categories.push(`${item['_id']['day']}/${item['_id']['month']}/${item['_id']['year']}`);
            }
          }

          this.chartOptions.series = series;
          this.chartOptions.xaxis = {
            ...this.chartOptions.xaxis,
            categories
          };
        }

        if (data['payload']['appIds']) {
          this.topAppIdsData = data['payload']['appIds'];
        }
      }
    }, () => {
      this.toastrService.error('Something went wrong, Try again.', 'Error!');
    });
  }

  calculatePercentage(dividend: number, divisor: number) {
    if (dividend === 0 && divisor === 0) return 0;
    if (dividend === 0 || divisor === 0) return 100;
    let temp: number;
    if (dividend > divisor) {
      temp = divisor;
      divisor = dividend;
      dividend = temp;
    }
    return ((divisor - dividend) / divisor) * 100;
  }

  onChange(value) {
    let getProgressCardsData = false;
    let getStatChartData = false;
    let getTopAppIdsData = false;

    if (value === 'progressCards') {
      if (this.progressCardsDateRange === 0) {
        this.toastrService.info('Please select valid date range!');
        return;
      }
      getProgressCardsData = true;
    } else if (value === 'statChart') {
      if (this.statChartDateRange === 0) {
        this.toastrService.info('Please select valid date range!');
        return;
      }
      getStatChartData = true;
    } else if (value === 'topAppIds') {
      if (this.topAppIdsDateRange === 0) {
        this.toastrService.info('Please select valid date range!');
        return;
      }
      if (this.topAppIdsLimit === 0) {
        this.toastrService.info('Please select valid limit!');
        return;
      }
      getTopAppIdsData = true;
    }

    this.getDashboardData(getProgressCardsData, getStatChartData, getTopAppIdsData);
    this.setLocalStorageDropdownOptions();
  }
}
