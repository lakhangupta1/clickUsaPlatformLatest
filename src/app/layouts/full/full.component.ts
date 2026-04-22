import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener, inject, TemplateRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { NgbCollapseModule, NgbNavModule, NgbOffcanvas, NgbPopoverModule, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { BreadcrumbComponent } from 'src/app/shared/breadcrumb/breadcrumb.component';
import { HorizontalNavigationComponent } from 'src/app/shared/horizontal-header/horizontal-navigation.component';
import { HorizontalSidebarComponent } from 'src/app/shared/horizontal-sidebar/horizontal-sidebar.component';
import { VerticalNavigationComponent } from 'src/app/shared/vertical-header/vertical-navigation.component';
import { VerticalSidebarComponent } from 'src/app/shared/vertical-sidebar/vertical-sidebar.component';
declare var $: any;

import { options } from 'src/app/config';
import { CustomizerComponent } from 'src/app/shared/customizer/customizer.component';
import { FeatherModule } from 'angular-feather';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NetworkService } from 'src/app/services/network.service';
import { PublisherService } from 'src/app/services/publisher.service';
import { ModarnComponent } from "src/app/components/dashboards/modarn/modarn.component";
import { DashboardComponent } from 'src/app/components/dashboards/dashboard/dashboard.component';
import { GeneralComponent } from "src/app/components/dashboards/general/general.component";
import { ClassyComponent } from "src/app/components/dashboards/classy/classy.component";
import { AwasomeComponent } from "src/app/components/dashboards/awasome/awasome.component";
import { AnalyticalComponent } from "src/app/components/dashboards/analytical/analytical.component";
import { MinimalComponent } from "src/app/components/dashboards/minimal/minimal.component";
import { LuxedashboardComponent } from "src/app/components/dashboards/luxedashboard/luxedashboard.component";
import { VantadashboardComponent } from "src/app/components/dashboards/vantadashboard/vantadashboard.component";
import { SmartDashboardComponent } from 'src/app/components/dashboards/smart-dashboard/smart-dashboard.component';
import { filter } from 'rxjs';
import { PublisherData } from 'src/app/shared/model/profile.model';

 

@Component({
  selector: 'app-full-layout',
  standalone: true,
  imports: [
    VerticalNavigationComponent,
    VerticalSidebarComponent,
    HorizontalNavigationComponent,
    HorizontalSidebarComponent,
    NgbNavModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbCollapseModule,
    NgScrollbarModule,
    CustomizerComponent, FeatherModule,
    ModarnComponent,
    DashboardComponent,
    GeneralComponent,
    ClassyComponent,
    AwasomeComponent,
    AnalyticalComponent,
    MinimalComponent,
    LuxedashboardComponent,
    VantadashboardComponent,
    SmartDashboardComponent,
    BreadcrumbComponent,
    NgbPopoverModule
  ],
  templateUrl: './full.component.html',
})
export class FullComponent implements OnInit {
  showManager = false;
  active = 1;
  isThemeData = false;
  data: any;
  userData: any;
  appDomain: any
  company_name: any
  company_logo: any
  medLogo = "";
  smallLogo = "";
  // publisherData = {}
  publisherData: PublisherData

  favIcon: HTMLLinkElement = document.querySelector('#appIcon');

  tabStatus = 'justified';
  currentUrl: string = '';

  constructor(public router: Router,
    private authService: AuthenticationService,
    private networkService: NetworkService,
    private publisherService: PublisherService,
    private route: ActivatedRoute
  ) {

  }

  private offcanvasService = inject(NgbOffcanvas);
  closeResult = '';

  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  open(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case OffcanvasDismissReasons.ESC:
        return 'by pressing ESC';
      case OffcanvasDismissReasons.BACKDROP_CLICK:
        return 'by clicking on the backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  themeOptions = options;

  public isCollapsed = false;

  public innerWidth: any;
  public defaultSidebar: any;
  public showSettings = false;
  public showMobileMenu = false;
  public expandLogo = false;

  Logo() {
    this.expandLogo = !this.expandLogo;
  }

  ngOnInit() {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
      });

    this.currentUrl = this.router.url;
    this.appDomain = this.networkService.domain
    this.userData = this.authService.getUserDetails;
    // console.log("appDomain",this.appDomain);
    console.log("userData--",this.userData);
    // console.log("themeOptions--",this.themeOptions)
    if (this.userData && this.userData['userDetail'] && this.userData['userDetail']['network'] && this.userData['userDetail']['network'][0]) {
      this.networkService.getThemeData(this.userData['userDetail']['network'][0]).subscribe(res => {
        // console.log("res-------", res)
        // console.log("res--1", res['payload'][0]['pthemeM'])
        this.themeOptions['theme'] = res['payload'][0]['pthemeM']['theme'];
        this.themeOptions['boxed'] = res['payload'][0]['pthemeM']['boxed'];
        this.themeOptions['dir'] = res['payload'][0]['pthemeM']['dir'];
        this.themeOptions['navbarbg'] = res['payload'][0]['pthemeM']['navbarbg'];
        this.themeOptions['sidebarbg'] = res['payload'][0]['pthemeM']['sidebarbg'];
        this.themeOptions['logobg'] = res['payload'][0]['pthemeM']['logobg'];
        this.themeOptions['layout'] = res['payload'][0]['pthemeM']['layout'];
        this.themeOptions['sidebarpos'] = res['payload'][0]['pthemeM']['sidebarpos'];
        this.themeOptions['headerpos'] = res['payload'][0]['pthemeM']['headerpos'];
        this.themeOptions['dashboard'] = res['payload'][0]['pthemeM']['dashboard'] || options['dashboard'];

        this.isThemeData = true
      });
    }
    else {
      this.isThemeData = true;
    }

    // this.getUserCompanyName();
    this.getPublisherAccManagerDetails(this.userData.userDetail.parentId[0]);
    this.defaultSidebar = options.sidebartype;
    this.handleSidebar();
    // if (this.router.url === '/dashboard') {
    //   this.router.navigate(['/dashboard/']);
    // }
    // this.defaultSidebar = this.themeOptions.sidebartype;
    // this.handleSidebar();
    // document.body.setAttribute('data-bs-theme', this.themeOptions.theme);



  }

  // getUserCompanyName() {
  //   if (this.userData['userDetail']['company_name']) {
  //     this.company_name = this.userData['userDetail']['company_name']
  //   }
  //   this.networkService.getNetworkDataSearch(this.userData['userDetail']['network']).subscribe(
  //   //   res => {
  //   //     if (res[0]) {
  //   //       this.data = res[0].networklogo_Url;
  //   //       let tempLogo = res[0].networklogo_Url.split(".");
  //   //       for (let i in tempLogo) {
  //   //         if (i + 1 >= (tempLogo.length)) {
  //   //           this.medLogo = this.medLogo + "medium." + tempLogo[i];
  //   //           this.smallLogo = this.smallLogo + "small." + tempLogo[i];
  //   //         } else {
  //   //           this.medLogo = this.medLogo + tempLogo[i];
  //   //           this.smallLogo = this.smallLogo + tempLogo[i];
  //   //         }
  //   //       }
  //   //       this.favIcon.href = this.appDomain + this.smallLogo;
  //   //     }
  //   //   }
  //   // );
  // }

  getPublisherAccManagerDetails(parentId) {
    if (parentId) {
      this.publisherService.getPublisher(parentId).subscribe(result => {
        if (!result['err']) {
          this.publisherData = result['payload'];
          // console.log("publisherData -ff",this.publisherData);
        }
      })
    }
  }
  @HostListener('window:resize', [''])
  onResize(event: string) {
    this.handleSidebar();
  }

  handleSidebar() {
    this.innerWidth = window.innerWidth;
    switch (this.defaultSidebar) {
      case 'full':
        if (this.innerWidth < 1170) {
          this.themeOptions.sidebartype = 'mini-sidebar';
        } else {
          this.themeOptions.sidebartype = this.defaultSidebar;
        }
        break;

      default:
    }
  }

  toggleSidebarType() {
    switch (this.themeOptions.sidebartype) {
      case 'full':
        this.themeOptions.sidebartype = 'mini-sidebar';
        break;
      case 'mini-sidebar':
        if (this.defaultSidebar === 'mini-sidebar') {
          this.themeOptions.sidebartype = 'full';
        } else {
          this.themeOptions.sidebartype = this.defaultSidebar;
        }
        break;

      default:
    }
  }

  handleClick(event: boolean) {
    this.showMobileMenu = event;
  }
}
