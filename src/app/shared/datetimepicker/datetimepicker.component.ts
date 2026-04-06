
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDatepickerModule, NgbTimepickerModule, NgbPopover, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-datetimepicker',
	standalone: true,
	imports: [CommonModule, NgbDatepickerModule, FormsModule, NgbTimepickerModule, NgbPopoverModule],
	templateUrl: './datetimepicker.component.html',
	styleUrls: ['./datetimepicker.component.scss']
})
export class DatetimepickerComponent {

	@Output() dateRangeSelected = new EventEmitter<{ fromDate: NgbDate, fromTime: { hour: number, minute: number }, toDate: NgbDate, toTime: { hour: number, minute: number } }>();
	@ViewChild('popover') popover: NgbPopover;
	meridian = true;
	showPopover = true;
	calendar = inject(NgbCalendar);

	hoveredDate: NgbDate | null = null;
	fromDate: NgbDate = this.calendar.getToday();
	toDate: NgbDate | null = this.calendar.getNext(this.fromDate, 'd', -2);

	fromTime = { hour: 0, minute: 0 };
	toTime = { hour: 23, minute: 59 };


	selectedTime: string = '';
	dateTimeRangeData: any;
	focused: any;


	formatDateTime(date: NgbDate, time: { hour: number, minute: number }): string {
		const formattedDate = `${date.year}/${date.month}/${date.day}`;
		const formattedTime = `${time.hour}:${time.minute < 10 ? '0' + time.minute : time.minute}`;
		return `${formattedDate}, ${formattedTime}`;
	}

	onDateSelection(date) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
			this.fromTime = { hour: 12, minute: 0 };
		} else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
			this.toDate = date;
			this.toTime = { ...this.fromTime };
		} else {
			this.toDate = null;
			this.fromDate = date;
			this.fromTime = { hour: 12, minute: 0 };
		}
		this.dateRangeSelected.emit({ fromDate: this.fromDate, fromTime: this.fromTime, toDate: this.toDate, toTime: this.toTime });
	}

	calculateDateDifference(fromDate: NgbDate, toDate: NgbDate): number {
		const fromDateObj: Date = new Date(fromDate.year, fromDate.month - 1, fromDate.day);
		const toDateObj: Date = new Date(toDate.year, toDate.month - 1, toDate.day);
		const timeDiff = Math.abs(toDateObj.getTime() - fromDateObj.getTime());
		return Math.ceil(timeDiff / (1000 * 3600 * 24));
	}

	calculateTimeDifference(fromTime: { hour: number, minute: number }, toTime: { hour: number, minute: number }): string {
		let fromTimeInMinutes = fromTime.hour * 60 + fromTime.minute;
		let toTimeInMinutes = toTime.hour * 60 + toTime.minute;

		if (toTimeInMinutes < fromTimeInMinutes) {
			toTimeInMinutes += 24 * 60;
		}

		const diffInMinutes = toTimeInMinutes - fromTimeInMinutes;
		const hours = Math.floor(diffInMinutes / 60);
		const minutes = diffInMinutes % 60;

		return `${hours} hours ${minutes} minutes`;
	}

	isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

	onChangedateTimeRangeOption(value) {
		if (value !== '7') {
		  let today = this.calendar.getToday();
		  if (value === '1') {
			this.fromDate = this.toDate = today;
		  } else if (value === '2') {
			this.fromDate = this.toDate = this.calendar.getPrev(today, 'd', 1);
		  } else if (value === '3') {
			this.fromDate = this.calendar.getPrev(today, 'd', this.calendar.getWeekday(today) - 1);
			this.toDate = today;
		  } else if (value === '4') {
			let weekday = this.calendar.getWeekday(today);
			this.fromDate = this.calendar.getPrev(today, 'd', weekday + 6);
			this.toDate = this.calendar.getPrev(today, 'd', weekday);
		  } else if (value === '5') {
			this.fromDate = NgbDate.from({ year: today['year'], month: today['month'], day: 1 });
			this.toDate = today;
		  } else if (value === '6') {
			this.fromDate = NgbDate.from({ year: today['year'], month: today['month'] - 1, day: 1 });
			this.toDate = NgbDate.from({ year: today['year'], month: today['month'], day: 1 });
			this.toDate = this.calendar.getPrev(this.toDate, 'd', 1);
		  }
		  
		}
	  }
}

