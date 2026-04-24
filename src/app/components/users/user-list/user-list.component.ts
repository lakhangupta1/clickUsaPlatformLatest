import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbPagination, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
// import { IModal, ModalType, Size } from 'src/app/shared/model/model/model.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule, NgbPagination, NgbTooltip, RouterModule ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  companyName: any[] = [];
  allUsers : any[] = [];
  page = 1;
  loading : boolean = false;
  companyUserId: string | null = null;
  emailUserId: string | null = null;
  manualUserId: string = '';
  userCount : number = 0;
  status: string = '';
  limit: number = 10;
  selectedRecord: any;

  constructor(private userService: UserService, 
    private toastr : ToastrService
  ) {}

  ngOnInit(): void {

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

    this.userService.getUserDetails({ limit : this.limit , page : this.page }).subscribe({
      next: (result: any) => {
        console.log("result -> ", result);
        this.companyName = result?.payload || [];
        // this.userCount = result?.userCount || 0;
        console.log(" total user userCount -> ", this.userCount);
      },
      error: (error) => {
        console.error("error -> ", error);
      }
    });
  }

  onFilter(){
    let filter = {
      // skip: (this.page - 1) * this.limit,
      limit: this.limit,
      page : 1, // this.page,
      // status : this.status
    }
    if(this.status){
      filter['status'] = this.status
    }
    if(this.companyUserId || this.emailUserId || this.manualUserId ){
        filter['user_id'] = this.companyUserId || this.emailUserId || this.manualUserId;
    }
    this.userService.getUserDetails(filter).subscribe({
      next: (result: any) => {
        console.log("result -> ", result);
        this.companyName = result?.payload || [];
        this.userCount = result?.userCount || 0;
        console.log(" total user userCount -> ", this.userCount);
      },
      error: (error) => {
        console.error("error -> ", error);
      }
    });
  }
  reset() {
    this.companyUserId = null;
    this.emailUserId = null;
    this.manualUserId = null;
    this.status = '';
    this.limit = 10;
  }

  showUserId() {
    console.log("Company ID -> ", this.companyUserId);
    console.log("Email ID -> ", this.emailUserId);
    console.log("Manual ID -> ", this.manualUserId);
    console.log("Status -> ", this.status);
    console.log("Limit -> ", this.limit);
  }

  getPage(page: number) {
    this.page = page;
    this.loading = true;

    const filter = {
      skip: (this.page - 1) * this.limit,
      limit: this.limit,
      page : this.page
    };

    if(this.status){
      filter['status'] = this.status;
    }

    if(this.companyUserId || this.emailUserId || this.manualUserId ){
        filter['user_id'] = this.companyUserId || this.emailUserId || this.manualUserId;
    }
    console.log('filter:', filter);  
    this.userService.getUserDetails(filter).subscribe({
      next: (result: any) => {
        console.log("result -> ", result);
        this.companyName = result?.payload || [];
        this.userCount = result?.userCount || 0;
        console.log(" total user userCount -> ", this.userCount);
      },
      error: (error) => {
        console.error("error -> ", error);
      }
    });
  }
}