import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, EventEmitter, Output, inject, TemplateRef, OnInit } from '@angular/core';
import {
  NgbModal,
  NgbDropdownModule,
  NgbAccordionModule,
  NgbCarouselModule,
  NgbDatepickerModule,
  NgbOffcanvas,
  OffcanvasDismissReasons
} from '@ng-bootstrap/ng-bootstrap';

import { TranslateService } from '@ngx-translate/core';
import { FeatherModule } from 'angular-feather';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { RouterModule } from '@angular/router';
import { options } from 'src/app/config';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PublisherService } from 'src/app/services/publisher.service';
import { NetworkService } from 'src/app/services/network.service';
import { PublisherData } from '../model/profile.model';

declare var $: any;

@Component({
  selector: 'app-vertical-navigation',
  standalone: true,
  imports: [
    NgbDropdownModule,
    CommonModule,
    FeatherModule,
    NgbAccordionModule,
    NgbCarouselModule,
    NgbDatepickerModule,
    NgScrollbarModule, RouterModule
  ],
  templateUrl: './vertical-navigation.component.html',
})
export class VerticalNavigationComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  themeOptions = options;

  setBodyAttribute(attribute: string, value: string): void {
    document.body.setAttribute(attribute, value);
  }




  public showSearch = false;
  name = '';
  email = '';
  image = 'assets/images/users/user1.jpg';

  data: any;
  userData: any;
  appDomain: any
  company_name: any
  company_logo: any
  medLogo = "";
  smallLogo = "";
  // publisherData = {}
  publisherData: PublisherData;


  public selectedLanguage: any = {
    language: 'English',
    code: 'en',
    type: 'US',
    icon: 'us',
  };

  public languages: any[] = [
    {
      language: 'English',
      code: 'en',
      type: 'US',
      icon: 'us',
    },
    {
      language: 'Español',
      code: 'es',
      icon: 'es',
    },
    {
      language: 'Français',
      code: 'fr',
      icon: 'fr',
    },
    {
      language: 'German',
      code: 'de',
      icon: 'de',
    },
  ];

  constructor(
    private modalService: NgbModal,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private publisherService: PublisherService,
    private networkService: NetworkService
  ) {
    translate.setDefaultLang('en');
  }

  ngAfterViewInit() { }

  changeLanguage(lang: any) {
    this.translate.use(lang.code);
    this.selectedLanguage = lang;
  }

  ngOnInit(): void {
    this.appDomain = this.networkService.domain
    let currentUser = this.authenticationService.getUserDetails;
    console.log("currentUser --lakhan ", currentUser['userDetail']);
    if (currentUser && currentUser['userDetail']) {
      // if (currentUser['userDetail']['name']) {
      //   this.name = currentUser['userDetail']['name'];
      // }
      // if (currentUser['userDetail']['email']) {
      //   this.email = currentUser['userDetail']['email'];
      // }
    }
    const publisherId = currentUser.userDetail.id;
    console.log("publisherId", publisherId );
    if (publisherId) {
      this.getPublisher(publisherId);
    }
  }

  getPublisher(id: string) {
    this.publisherService.getPublisher(id).subscribe({
      next: (result) => {
        if (!result.err) {
          this.publisherData = result['payload'];
          // console.log("Publisher Data:", this.publisherData);
          this.email = this.publisherData['email'];
          this.name = this.publisherData['name'];
          this.company_logo = this.publisherData['company_logo'];
          // console.log("this.company_logo",this.company_logo); 
        }
      },
      error: (err) => {
        console.error("Publisher API Error:", err);
      }
    });
  }

  logout() {
    this.authenticationService.logout();
    sessionStorage.removeItem('preVisitedPath');
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
