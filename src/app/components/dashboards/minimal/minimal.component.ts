import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTheme,
  ApexTooltip,
  ApexDataLabels,
  ApexLegend,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexResponsive,
  NgApexchartsModule,
  ChartComponent
} from 'ng-apexcharts';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/services/dashboard.service';

export type ChartOptions = {
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
  plotOptions: ApexPlotOptions | any;
  fill: ApexFill | any;
  labels: string[] | any;
  responsive: ApexResponsive | any;
};

@Component({
  selector: 'app-minimal',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule, FormsModule],
  templateUrl: './minimal.component.html',
  styleUrl: './minimal.component.scss'
})
export class MinimalComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  public mixedChartOptions: Partial<ChartOptions>;

  progressCardsDateRange = 7;
  statChartDateRange = 1;
  topAppIdsLimit = 5;
  topAppIdsDateRange = 1;
  topAppIdsData = [];

  colors = {
    click: '#00317a',
    conversion: '#651175',
    revenue: '#005c31',
    cr: '#f50505'
  };

  progressCardsData = {
    click: { previousValue: 0, currentValue: 0, percentValue: 0, bgcolor: this.colors.click, color: "#ffffff" },
    conversion: { previousValue: 0, currentValue: 0, percentValue: 0, bgcolor: this.colors.conversion, color: "#ffffff" },
    revenue: { previousValue: 0, currentValue: 0, percentValue: 0, bgcolor: this.colors.revenue, color: "#ffffff" },
  };

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private dashboardService: DashboardService
  ) {

    this.mixedChartOptions = {
      series: [
        { name: 'Click', data: [] },
        { name: 'Conversion', data: [] },
        { name: 'CR (0-1)', data: [] }
      ],
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
        toolbar: { show: false },
        offsetY: -10
      },
      stroke: {
        width: [3, 3, 3],
        curve: 'smooth',
      },
      colors: [this.colors.click, this.colors.conversion, this.colors.cr],
      xaxis: {
        type: 'category',
        labels: {
          show: false,
          style: { colors: '#a1aab2' }
        },
        axisTicks: { show: false },
        axisBorder: { show: false },
        categories: [],

      },
      yaxis: [
        {
          tickAmount: 9,
          show: false,
          title: { text: 'Click' },
        },
        {
          tickAmount: 8,
          show: false,
          opposite: false,
          title: { text: 'Conversion' },
        },
        {
          tickAmount: 5,
          min: 0,
          max: 1,
          opposite: true,
          title: { text: 'CR (0-1)' },
        }
      ],
      tooltip: {
        shared: true,
        intersect: false,
      },
      legend: {
        position: 'top'
      },
      grid: {
        padding: { bottom: -10 }
      },

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

  getDateRange(option) {
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
            { name: 'Click', data: [] },
            { name: 'Conversion', data: [] },
            { name: 'CR (0-1)', data: [] }
          ];
          const categories = [];

          for (const item of data['payload']['overallStat']) {
            series[0].data.push(item['click'] || 0);
            series[1].data.push(item['conversion']);

            let cr = 0;
            if (item['click'] && item['conversion']) {
              cr = Number(((item['conversion'] / item['click']) * 100).toFixed(2));
            }
            series[2].data.push(cr);

            if (item['_id']?.hour >= 0) {
              categories.push('Hour ' + item['_id']['hour']);
            } else if (item['_id']?.day && item['_id']?.month && item['_id']?.year) {
              categories.push(`${item['_id']['day']}/${item['_id']['month']}/${item['_id']['year']}`);
            }
          }

          // this.mixedChartOptions = {
          //   ...this.mixedChartOptions,
          //   series,
          //   xaxis: { categories }
          // };
          this.mixedChartOptions = {
            ...this.mixedChartOptions,
            series,
            xaxis: {
              ...this.mixedChartOptions.xaxis,
              categories: categories
            }
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
