import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { NotifierModule, NotifierService } from 'angular-notifier';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

  @Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [ NotifierModule, NgbTooltip, CommonModule, RouterModule ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  userId : any = '';
  userData : any = '';
  private notifier : NotifierService;
  constructor( private activatedRoute : ActivatedRoute,
      private userService : UserService,
      private notifierService : NotifierService
   ){
    this.notifier = notifierService;
  }

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');
    this.userService.getUserById(this.userId).subscribe({
      next : ( res) => {
        // console.log(" userService res", res );
        if(!res.err){
          this.userData = res?.payload;
          console.log(" userData userService -> ", this.userData );
          this.notifier.notify('success', 'User get successfully.');
        }else{

        }
      },
      error : (error ) => {

      }
    })
  }
}
