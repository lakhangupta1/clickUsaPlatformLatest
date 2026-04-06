import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PostbackService } from 'src/app/services/postback.service';
import { Shorten4Pipe, ShortenPipe } from 'src/app/shared/shorten/shorten.pipe';

@Component({
  selector: 'app-postback-list',
  standalone: true,
  imports: [CommonModule, RouterModule, Shorten4Pipe, FormsModule, ShortenPipe, NgxPermissionsModule, NgbTooltipModule],
  templateUrl: './postback-list.component.html',
  styleUrl: './postback-list.component.scss'
})
export class PostbackListComponent implements OnInit {
  userData: any;
  pid: any;
  postbackList = [];
  holdPostbackList = [];
  deleteText: string = "";

  constructor(private authService: AuthenticationService,
    private PostbackService: PostbackService,
    private router: Router,
    private toastrService: ToastrService,
    private modelService: NgbModal) {
    this.userData = this.authService.getUserDetails.userDetail;
  }

  ngOnInit(): void {

    this.postbackList = [];
    this.holdPostbackList = [];
    if (this.userData.pid) {
      this.PostbackService.getPostbackId(this.userData.pid).subscribe(
        (apiResult) => this.postbackList = (apiResult && apiResult['payload'] && apiResult['payload'].length) ? apiResult['payload'] : [],
        (error) => this.toastrService.error(error['msg'])
      );
      this.PostbackService.getAllHoldPostback(this.userData.pid).subscribe(
        (apiResult) => this.holdPostbackList = (apiResult && apiResult['payload'] && apiResult['payload'].length) ? apiResult['payload'] : [],
        (error) => this.toastrService.error(error['msg'])
      )
    }
    else {
      this.toastrService.error("Login again!");
      this.router.navigate(['/login']);
    }
  }

  onDeleteHoldPostback(id: string, deleteConfirmModal: any) {
    const modelref = this.modelService.open(deleteConfirmModal, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: true, size: 'lg' });
    modelref.result.then(userResponse => {
      if (userResponse == 'true') {
        this.PostbackService.deleteHoldPostback(id).subscribe(
          (apiResult) => {
            if (!apiResult) this.toastrService.error("Not Found");
            else if (apiResult['err']) this.toastrService.error(apiResult['msg']);
            else this.holdPostbackList = this.holdPostbackList.filter(ele => ele._id != id);
          },
          (error) => this.toastrService.error(error['msg'])
        )
      }
    })
  }

  addPostback() {
    if (this.userData.pid) this.router.navigate(['/postback/add/', this.userData.pid]);
    else this.toastrService.error("Not authorized user!");
  }
}
