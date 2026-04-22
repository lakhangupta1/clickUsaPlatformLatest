import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RouteInfo } from './vertical-sidebar.metadata';
import { VerticalSidebarService } from './vertical-sidebar.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { options } from 'src/app/config';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NetworkService } from 'src/app/services/network.service';
import { PublisherService } from 'src/app/services/publisher.service';
interface PublisherData {
  _id: string;
  network_id: string;
  name: string;
  company: string;
  company_logo?: string;
  account_manager?: any;
}
@Component({
  selector: 'app-vertical-sidebar',
  standalone: true,
  imports: [TranslateModule, RouterModule, CommonModule, FeatherModule, NgbDropdownModule],
  templateUrl: './vertical-sidebar.component.html',
})

export class VerticalSidebarComponent implements OnInit {
  // logo
  data: any;
  userData: any;
  appDomain: any
  company_name: any
  company_logo: any
  medLogo = "";
  smallLogo = "";
  // publisherData = {}
  publisherData: PublisherData = {} as PublisherData;

  favIcon: HTMLLinkElement = document.querySelector('#appIcon');

  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems: RouteInfo[] = [];
  path = '';

  themeOptions = options;

  @Input() showClass: boolean = false;
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  handleNotify() {
    this.notify.emit(!this.showClass);
  }

  constructor(
    private menuServise: VerticalSidebarService,
    private router: Router,
    private toasterService: ToastrService,
    private authService: AuthenticationService,
    private networkService: NetworkService,
    private publisherService: PublisherService
  ) {
    this.menuServise.items.subscribe((menuItems) => {
      this.sidebarnavItems = menuItems;

      // Active menu
      this.sidebarnavItems.filter((m) =>
        m.submenu.filter((s) => {
          if (s.path === this.router.url) {
            this.path = m.title;
          }
        })
      );
      this.addExpandClass(this.path);
    });
  }
  ngOnInit() {
    this.appDomain = this.networkService.domain
    this.userData = this.authService.getUserDetails;
    // this.getUserCompanyName();
    this.getPublisherAccManagerDetails(this.userData.userDetail.parentId[0]);

  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  // logo
  // getUserCompanyName() {
  //   if (this.userData['userDetail']['company_name']) {
  //     this.company_name = this.userData['userDetail']['company_name']
  //   }

  //   this.networkService.getNetworkDataSearch(this.userData['userDetail']['network']).subscribe(
  //     res => {
  //       if (res[0]) {
  //         this.data = res[0].networklogo_Url;
  //         let tempLogo = res[0].networklogo_Url.split(".");
  //         for (let i in tempLogo) {
  //           if (i + 1 >= (tempLogo.length)) {
  //             this.medLogo = this.medLogo + "medium." + tempLogo[i];
  //             this.smallLogo = this.smallLogo + "small." + tempLogo[i];
  //           } else {
  //             this.medLogo = this.medLogo + tempLogo[i];
  //             this.smallLogo = this.smallLogo + tempLogo[i];
  //           }
  //         }
  //         // this.favIcon.href = this.appDomain + this.smallLogo;
  //       }
  //     }
  //   );
  // }

  getPublisherAccManagerDetails(parentId) {
    if (parentId) {
      this.publisherService.getPublisher(parentId).subscribe(result => {
        if (!result['err']) {
          this.publisherData = result['payload'];
        }
      })
    }
  }

}
