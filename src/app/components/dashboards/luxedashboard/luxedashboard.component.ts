import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexTheme, ApexTooltip, ApexDataLabels, ApexLegend, ApexGrid, ApexPlotOptions, ApexFill, ApexResponsive, NgApexchartsModule } from 'ng-apexcharts';
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
  selector: 'app-luxedashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './luxedashboard.component.html',
  styleUrl: './luxedashboard.component.scss'
})
export class LuxedashboardComponent {
  public mixedChartOptions: Partial<ChartOptions>;

  progressCardsDateRange = 7;
  statChartDateRange = 1;
  topAppIdsLimit = 5;
  topAppIdsDateRange = 1;
  topAppIdsData = [];


  colors1 = {
    click: 'linear-gradient(45deg, #030396, #a504a5)',
    conversion: 'linear-gradient(45deg, #030396, #a504a5)',
    revenue: 'linear-gradient(45deg, #030396, #a504a5)',
    cr: 'linear-gradient(45deg, #e53935, #ffb300)'
  };

  colors = {
    click: '#0301a1',
    conversion: '#ff0000',
    revenue: '#be5f5fff',
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
    this.mixedChartOptions = {
      series: [
        {
          name: 'Click',
          type: 'column',
          data: [],
        },
        {
          name: 'Conversion',
          type: 'area',
          data: [],
        },
        {
          name: 'CR',
          type: 'line',
          data: [],
        },
      ],
      chart: {
        height: 300,
        type: 'line',
        stacked: false,
        toolbar: {
          show: false,
        },
      },
      stroke: {
        width: [1, 2, 3],
        curve: 'smooth',
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
        },
      },
      fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100],
        },
      },
      markers: {
        size: 4,
        strokeColors: '#fff',
        hover: { size: 6 },
      },
      xaxis: {
        type: 'category',
        categories: [],
        labels: {
          rotate: -45,
          show: false,
        },
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
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (value: any, {}) => {
             return `: ${value}`;
          }
        },
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
            { name: 'Click', type: 'column', data: [] },
            { name: 'Conversion', type: 'area', data: [] },
            { name: 'CR (0-1)', type: 'line', data: [] },
          ];
          const categories = [];

          for (const item of data['payload']['overallStat']) {
            const click = Number(item['click'] || 0);
            const conversion = Number((item['conversion'] || 0) );
            let cr = 0;
            if (click > 0 && item['conversion'] > 0) {
              cr = Number(((item['conversion'] / click) * 100).toFixed(2));
              if (cr > 1) cr = 1;
            }
            series[0].data.push(click);
            series[1].data.push(conversion);
            series[2].data.push(cr);

            if (item['_id']?.hour >= 0) {
              categories.push(`Hour ${item['_id']['hour']}`);
            } else if (item['_id']?.day && item['_id']?.month && item['_id']?.year) {
              categories.push(`${item['_id']['day']}/${item['_id']['month']}`);
            } else {
              categories.push('Unknown');
            }
          }

          this.mixedChartOptions = {
            ...this.mixedChartOptions,
            series: series,
            xaxis: {
              ...this.mixedChartOptions.xaxis,
              categories,
            },
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
