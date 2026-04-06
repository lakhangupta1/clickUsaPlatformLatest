import { CommonModule, JsonPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDatepickerModule, NgbDateStruct, NgbModule, NgbPopover, NgbPopoverModule, NgbTimepickerConfig, NgbTimepickerModule, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-datetime-range-picker',
  standalone: true,
  imports: [NgbDatepickerModule,
    NgbTimepickerModule,
    NgbPopoverModule,
    FormsModule,
    CommonModule,
    NgbModule],
  templateUrl: './datetime-range-picker.component.html',
  styleUrl: './datetime-range-picker.component.scss'
})
export class DatetimeRangePickerComponent implements OnInit, OnChanges {
  @ViewChild('popover') popover: NgbPopover;
  showPopover = true;
  @Input() dateTimeRangeOption: any = '1';
  startDate: NgbDate = this.calendar.getToday();
  startTime = { hour: 0, minute: 0, second: 0 };
  endDate: NgbDate = this.calendar.getToday();
  // endTime = { hour: 23, minute: 59, second: 0 };
  endTime = { hour: new Date().getHours(), minute: new Date().getMinutes(), second: new Date().getSeconds() };
  dateTimeRange = '';
  @Output() dateTimeRangeData = new EventEmitter();

  constructor(private calendar: NgbCalendar, config: NgbTimepickerConfig) {
    config.spinners = false;
    config.seconds = true;
  }

  ngOnInit(): void {
    this.onChangedateTimeRangeOption(this.dateTimeRangeOption);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onChangedateTimeRangeOption(this.dateTimeRangeOption);
  }

  openPopover() {
    if (this.popover) {
      this.popover.open();
      this.showPopover = false;
    }
  }

  closePopover() {
    if (this.popover) {
      this.popover.close();
      this.showPopover = true;
    }
  }


  setDateTimeRange() {
    let startDateTime = this.startDate['year'] + '/' + this.startDate['month'] + '/' + this.startDate['day'] + ', ' + this.startTime['hour'] + ':' + this.startTime['minute'];
    let endDateTime = this.endDate['year'] + '/' + this.endDate['month'] + '/' + this.endDate['day'] + ', ' + this.endTime['hour'] + ':' + this.endTime['minute'];
    this.dateTimeRange = startDateTime + ' - ' + endDateTime;

    this.dateTimeRangeData.emit({
      'startDateTime': new Date(this.startDate['year'], this.startDate['month'] - 1, this.startDate['day'], this.startTime['hour'], this.startTime['minute']),
      'endDateTime': new Date(this.endDate['year'], this.endDate['month'] - 1, this.endDate['day'], this.endTime['hour'], this.endTime['minute'], 59, 999),
      'dateTimeRangeOption': this.dateTimeRangeOption
    });
  }

  onChangedateTimeRangeOption(e: Event) {
    let value: any;
    let target = e.target as HTMLSelectElement;
    if (target && target.value) {
      this.dateTimeRangeOption = target.value;
      value = target.value;
    }
    if (value !== '7') {
      this.closePopover();
      let today = this.calendar.getToday();
      if (value === '1') {
        this.startDate = this.endDate = today;
      } else if (value === '2') {
        this.startDate = this.endDate = this.calendar.getPrev(today, 'd', 1);
      } else if (value === '3') {
        this.startDate = this.calendar.getPrev(today, 'd', this.calendar.getWeekday(today) - 1);
        this.endDate = today;
      } else if (value === '4') {
        let weekday = this.calendar.getWeekday(today);
        this.startDate = this.calendar.getPrev(today, 'd', weekday + 6);
        this.endDate = this.calendar.getPrev(today, 'd', weekday);
      } else if (value === '5') {
        this.startDate = NgbDate.from({ year: today['year'], month: today['month'], day: 1 });
        this.endDate = today;
      } else if (value === '6') {
        this.startDate = NgbDate.from({ year: today['year'], month: today['month'] - 1, day: 1 });
        this.endDate = NgbDate.from({ year: today['year'], month: today['month'], day: 1 });
        this.endDate = this.calendar.getPrev(this.endDate, 'd', 1);
      }
      this.setDateTimeRange();
    }
    this.closePopover();
  }

}
