import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ApexNonAxisChartSeries, ApexChart, ApexPlotOptions, ApexStroke, ApexDataLabels,
  ApexTooltip, ApexLegend, ApexGrid, ApexFill, NgApexchartsModule, ChartComponent,
  ApexAxisChartSeries, ApexResponsive, ApexStates, ApexTheme, ApexXAxis, ApexYAxis
} from 'ng-apexcharts';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/services/dashboard.service';

export interface newclientChartOptions {
  series: ApexNonAxisChartSeries | any;
  chart: ApexChart | any;
  labels: string[] | any;
  plotOptions: ApexPlotOptions | any;
  stroke: ApexStroke | any;
  dataLabels: ApexDataLabels | any;
  colors: string[] | any;
  tooltip: ApexTooltip | any;
  legend: ApexLegend | any;
  grid: ApexGrid | any;
  fill: ApexFill | any;
}

export type statistics = {
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
  labels: string[] | any;
  markers: any;
  grid: ApexGrid | any;
  fill: ApexFill | any;
  responsive: ApexResponsive | any;
  plotOptions: ApexPlotOptions | any;
  states: ApexStates | any;
};

@Component({
  selector: 'app-awasome',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule, FormsModule],
  templateUrl: './awasome.component.html',
  styleUrl: './awasome.component.scss'
})
export class AwasomeComponent {
  @ViewChild('chart') charts: ChartComponent = Object.create(null);
  public newclientChartOptions: Partial<newclientChartOptions>;
  public statistics: Partial<statistics>;
  public cards: any[] = [];

  progressCardsDateRange = 7;
  statChartDateRange = 1;
  topAppIdsLimit = 5;
  topAppIdsDateRange = 1;
  topAppIdsData = [];

  colors = {
    click: '#0d6efd',
    conversion: '#eeff03',
    revenue: '#52da04ff',
    cr: '#f50505'
  };
  bg = {
    click: "#ffc107",
    conversion: "linear-gradient(to left, #042170, #3b4dff)",
    revenue: "linear-gradient(to bottom, #198754, #5dd47f)",
  };

  progressCardsData = {
    click: { previousValue: 0, currentValue: 0, percentValue: 0, bgcolor: this.colors.click, color: "#ffffff", bgc: this.bg.click },
    conversion: { previousValue: 0, currentValue: 0, percentValue: 0, bgcolor: this.colors.conversion, color: "#ffffff", bgc: this.bg.conversion },
    revenue: { previousValue: 0, currentValue: 0, percentValue: 0, bgcolor: this.colors.revenue, color: "#ffffff", bgc: this.bg.revenue },
  };

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private dashboardService: DashboardService
  ) {
    this.buildCards();

    this.statistics = {
      series: [],
      chart: {
        fontFamily: "inherit",
        type: "bar",
        height: 400,
        offsetY: 10,
        toolbar: { show: false },
      },
      grid: {
        show: true,
        strokeDashArray: 3,
        borderColor: "rgba(0, 0, 0, 1)",
        xaxis: { lines: { show: true } },
      },
      colors: [this.colors.click, this.colors.conversion, this.colors.cr],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "80%",
          borderRadius: 6,
          endingShape: "rounded",
        },
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 5, colors: "transparent" },
      xaxis: {
        type: "category",
        categories: [],
        tickAmount: "5",
        tickPlacement: "on",
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: "#0c82e9" } },
      },
      yaxis: [
        { labels: { show: false, style: { colors: this.colors.click } } },
        { labels: { show: false } },
        {
          tickAmount: 5,
          opposite: true,
          title: { text: 'CR (0-1)' },
          labels: { style: { colors: this.colors.cr } },
          min: 0,
          max: 1
        }
      ],
      fill: { opacity: 1 },
      tooltip: {
        theme: "dark",
        shared: true,
        intersect: false,
        y: {
          formatter: (value: any, { }) => {
            return `: ${value}`;
          }
        }
      },
      legend: { show: true, position: 'top', horizontalAlign: 'left' },
    };
  }

  ngOnInit(): void {
    this.getLocalStorageDropdownOptions();
    this.getDashboardData();
  }

  // private buildCards() {
  //   this.cards = ['click', 'conversion', 'revenue'].map(key => {
  //     return {
  //       title: key.charAt(0).toUpperCase() + key.slice(1),
  //       value: this.progressCardsData[key].currentValue,

  //       chartOptions: this.generateChart(
  //         [
  //           this.progressCardsData[key].currentValue,
  //           this.progressCardsData[key].previousValue
  //         ],
  //         [
  //           String(this.progressCardsData[key].currentValue),
  //           String(this.progressCardsData[key].previousValue)
  //         ],
  //         this.progressCardsData[key].bgcolor,

  //       )
  //     };
  //   });
  // }

  private buildCards() {
    this.cards = ['click', 'conversion', 'revenue'].map(key => {
      const title = key.charAt(0).toUpperCase() + key.slice(1);
      return {
        title,
        value: this.progressCardsData[key].currentValue,
        bgColor: this.progressCardsData[key].color,
        bg: this.progressCardsData[key].bgc,
        color: this.progressCardsData[key].color,
        chartOptions: this.generateChart(
          [
            this.progressCardsData[key].currentValue,
            this.progressCardsData[key].previousValue
          ],
          [
            String(this.progressCardsData[key].currentValue),
            String(this.progressCardsData[key].previousValue)
          ],
          this.progressCardsData[key].bgcolor,
          title,
          this.progressCardsData[key].color,
        )
      };
    });
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

        this.buildCards();

        if (data['payload']['overallStat']) {
          const series = [
            { name: 'Click', data: [] },
            { name: 'Conversion', data: [] },
            { name: 'CR (0-1)', data: [] }
          ];
          const categories = [];

          for (const item of data['payload']['overallStat']) {
            series[0].data.push(item['click'] || 0);
            series[1].data.push(item['conversion'] || 0).toFixed(2);

            let cr = 0;
            if (item['click'] && item['conversion']) {
              cr = Number((item['conversion'] / item['click'] * 100).toFixed(2));
            }
            series[2].data.push(cr);

            if (item['_id']?.hour >= 0) {
              categories.push('Time: ' + item['_id']['hour']);
            } else if (item['_id']?.day && item['_id']?.month && item['_id']?.year) {
              categories.push(`${item['_id']['day']}/${item['_id']['month']}/${item['_id']['year']}`);
            }
          }

          this.statistics = {
            ...this.statistics,
            series,
            xaxis: { ...this.statistics.xaxis, categories }
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

  generateChart(series: number[], labels: string[], color: string, title: string, textColor: string) {
    const currentValue = series[0];
    const previousValue = series[1];
    const comparisonColor = currentValue < previousValue ? "#ff0202" : "#198754";

    return {
      series,
      labels,
      chart: {
        type: "donut",
        height: 95,
        fontFamily: "inherit",
      },
      plotOptions: {
        pie: {
          donut: {
            size: "85%",
            labels: {
              show: true,
              name: { show: true, offsetY: 7, color: "#ffffff" },
              value: { show: false },
              total: {
                show: true,
                color: "#fff",
                fontSize: "14px",
                fontWeight: "600",
                label: this.formatNumber(previousValue),
                // label: this.formatNumber(series.reduce((a, b) => a + b, 0)),
                // label: (series.reduce((a, b) => a + b, 0)).toFixed(2),
                // label: labels.reduce((b) => String(+b)),

              },
            },
          },
        },
      },
      grid: { show: false, padding: { top: 0, right: 0, bottom: 0, left: 0 } },
      stroke: { show: false },
      dataLabels: { enabled: false },
      legend: { show: false },
      colors: [color, comparisonColor],
      tooltip: {
        theme: "dark", fillSeriesColor: false,
        y: {
          formatter: (val) => val.toFixed(2),
          title: {
            formatter: () => title
          }
        }
      },
    };
  }


  formatNumber(value: number): string {
    if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (value >= 1_000) {
      return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return value.toString();
  }

}
