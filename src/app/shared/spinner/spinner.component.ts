import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent implements OnInit, OnDestroy {
  isSpinnerVisible: boolean;
  @Input() public backgroundColor = 'rgba(0, 115, 170, 0.69)';
  private subscription: any;

  constructor(private router: Router, private spinnerService: SpinnerService) {
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationStart) {
    //     this.isSpinnerVisible = true;
    //   }
    //   else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
    //     this.isSpinnerVisible = false;
    //   }
    // },
    //   (error) => {
    //     this.isSpinnerVisible = false
    //   });
    //   this.spinnerService.isSpinnerVisible.subscribe((flag) => {
    //     this.isSpinnerVisible = flag;
    //   });
  }

  ngOnInit(): void {
    this.subscription = this.spinnerService.isSpinnerVisible
      .subscribe(flag => {
        this.isSpinnerVisible = flag;
      });
  }
  ngOnDestroy(): void {
    this.isSpinnerVisible = false;
    this.subscription?.unsubscribe();
  }
}
