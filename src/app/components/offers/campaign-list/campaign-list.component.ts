import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { finalize, timeout } from 'rxjs/operators';

import { OffersService } from 'src/app/services/offers.service';
import { UserService } from 'src/app/services/user.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPermissionsModule } from 'ngx-permissions';

@Component({
  selector: 'app-campaign-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgbPaginationModule, NgSelectModule, NgxPermissionsModule],
  templateUrl: './campaign-list.component.html',
  styleUrl: './campaign-list.component.scss'
})
export class CampaignListComponent implements OnInit {
  allUsers : any[] = [];
  campaigns: any[] = [];
  userCount : number = 0;
  loading = false;
  companyUserId: string | null = null;
  // FILTER
  filter = {
    id: '',
    name: '',
    status: '',
    start_date: '',
    end_date: ''
  };

  // PAGINATION
  page = 1;
  limit = 5;
  offerCount = 0;

  constructor(private offersService: OffersService, private userService : UserService) {}

  ngOnInit(): void {
    this.getPage(1);
    this.userService.getAllUserDetails({ }).subscribe({
      next: (result: any) => {
        console.log("result -> ", result);
        this.allUsers = result?.payload || [];
        this.userCount = result?.userCount || 0;
        console.log(" total user userCount -> ", this.userCount);
      },
      error: (error) => {
        console.error("error -> ", error);
      }
    });
  }

  // ✅ MAIN API CALL
  getPage(page: number) {
    this.page = page;
    this.loading = true;

    const payload = {
      ...this.filter,
      skip: (this.page - 1) * this.limit,
      limit: this.limit
    };
    
    if(this.companyUserId){
      payload['companyUserId'] = this.companyUserId
    }

    console.log('Payload:', payload);

    this.offersService.getOffers(payload)
      .pipe(
        timeout(15000), // ⏱️ avoid infinite loading
        finalize(() => this.loading = false) // ✅ always stop loader
      )
      .subscribe({
        next: (response: any) => {

          console.log('API Response:', response);

          if (response && !response.err) {

            this.offerCount =
              response.count ??
              response.total ??
              response.payload?.length ??
              0;

            const data = response.payload || response.data || [];

            this.campaigns = data.map((item: any, index: number) => ({
              index: (this.page - 1) * this.limit + index + 1,
              _id: item._id,
              camp_name: item.camp_name,
              destination_url: item.destination_url,
              vartical: item.allow_traffic?.vartical || '-',
              os: item.allow_traffic?.os || '-',
              cpc: item.budget?.cpc ?? '-',
              status: item.status
            }));

          } else {
            this.campaigns = [];
          }
        },

        error: (err) => {
          console.error('API ERROR:', err);
          this.campaigns = [];
        }
      });
  }

  
  // ✅ APPLY FILTER
  applyFilter() {
    this.page = 1;
    this.getPage(1);
  }

  // ✅ RESET FILTER
  resetFilter() {
    this.filter = {
      id: '',
      name: '',
      status: '',
      start_date: '',
      end_date: ''
    };
    this.applyFilter();
  }

  // ✅ CHANGE LIMIT
  changeLimit() {
    this.page = 1;
    this.getPage(1);
  }
}