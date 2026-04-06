import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
  ApexFill,
  ApexPlotOptions,
  ApexStates,
  ChartComponent,
  NgApexchartsModule,
  ApexResponsive
} from 'ng-apexcharts';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/services/dashboard.service';

export type totalprofitChartOptions = {
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
  plotOptions: ApexPlotOptions | any;
  states: ApexStates | any;
  bgColor: string;
  key: string;
};

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
  selector: 'app-general',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule, FormsModule],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public lineChartOptions: Partial<ChartOptions>;
  public charts: Partial<totalprofitChartOptions>[] = [];

  progressCardsDateRange = 7;
  statChartDateRange = 1;
  topAppIdsLimit = 5;
  topAppIdsDateRange = 1;
  topAppIdsData = [];

  colors = {
    click: '#0d6efd',
    conversion: '#042170ff',
    revenue: '#198754',
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
    this.lineChartOptions = {
      series: [
        { name: 'Click', data: [] },
        { name: 'Conversion', data: [] },
        { name: 'CR (0-1)', data: [] }
      ],
      chart: {
        height: 300,
        type: 'line',
        fontFamily: 'inherit',
        toolbar: { show: false }
      },
      dataLabels: { enabled: false },
      markers: { size: 3, strokeColors: 'transparent' },
      stroke: { curve: 'straight', width: 3 },
      colors: [this.colors.click, this.colors.conversion, this.colors.cr],
      legend: { show: true, position: 'top', horizontalAlign: 'right' },
      grid: {
        show: true,
        strokeDashArray: 0,
        borderColor: 'rgba(0,0,0,0.1)',
      },
      xaxis: {
        type: 'category',
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: [
        {
          // title: { text: 'Clicks / Conversions' },
          labels: { show: false, style: { colors: this.colors.click } }
        }, {
          labels: { show: false }
        },
        {
          tickAmount: 5,
          opposite: true,
          title: { text: 'CR (0-1)' },
          labels: { style: { colors: this.colors.cr } },
          min: 0,
          max: 1
        }
      ],
      tooltip: { theme: 'dark' }
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

        this.charts = ['click', 'conversion', 'revenue'].map(key => {
          // const seriesData = [];
          // if (data['payload']['overallStat']) {
          //   const lastFive = data['payload']['overallStat'].slice(-5);
          //   console.log("lastFive", lastFive);
          //   for (const item of lastFive) {
          //     if (key === 'revenue') {
          //       seriesData.push(Number((item['payout'] || 0).toFixed(3)));
          //     } else {
          //       seriesData.push(Number(item[key] || 0));
          //     }
          //   }
          // } else {

          //   seriesData.push(this.progressCardsData[key].previousValue);
          //   seriesData.push(this.progressCardsData[key].currentValue);
          // }
          // return {
          //   series: [
          //     {
          //       name: key,
          //       data: seriesData
          //     }
          //   ],
          //   chart: { type: 'area', height: 75, sparkline: { enabled: true } },
          //   stroke: { curve: 'smooth', width: 2 },
          //   fill: { gradient: { opacityFrom: 0.3, opacityTo: 1 } },
          //   tooltip: { theme: 'dark' },
          //   colors: [this.progressCardsData[key].color],
          //   bgColor: this.progressCardsData[key].bgcolor,
          //   key,
          // };

          return {
            series: [
              {
                name: key,
                data: [
                  this.progressCardsData[key].previousValue,
                  this.progressCardsData[key].currentValue
                ]
              }
            ],
            chart: { type: 'area', height: 75, sparkline: { enabled: true } },
            stroke: { curve: 'smooth', width: 2 },
            fill: { gradient: { opacityFrom: 0.3, opacityTo: 0 } },
            tooltip: {
              theme: 'dark',
              x: {
                formatter: (value, { dataPointIndex }) => {
                  return dataPointIndex === 0 ? 'Previous' : 'Current';
                }
              }
            },
            colors: [this.progressCardsData[key].color],
            bgColor: this.progressCardsData[key].bgcolor,
            key,

          };
        });

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
              categories.push('Time: ' + item['_id']['hour']);
            } else if (item['_id']?.day && item['_id']?.month && item['_id']?.year) {
              categories.push(`${item['_id']['day']}/${item['_id']['month']}/${item['_id']['year']}`);
            }
          }

          this.lineChartOptions.series = series;
          this.lineChartOptions.xaxis = { ...this.lineChartOptions.xaxis, categories };
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
