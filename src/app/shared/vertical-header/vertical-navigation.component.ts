import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import {
  NgbModal,
  NgbDropdownModule,
  NgbAccordionModule,
  NgbCarouselModule,
  NgbDatepickerModule
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

@Component({
  selector: 'app-vertical-navigation',
  standalone: true,
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgbAccordionModule,
    NgbCarouselModule,
    NgbDatepickerModule,
    FeatherModule,
    NgScrollbarModule,
    RouterModule
  ],
  templateUrl: './vertical-navigation.component.html',
  styleUrls: ['./vertical-navigation.component.scss'] // ✅ FIXED
})
export class VerticalNavigationComponent implements OnInit {

  @Output() toggleSidebar = new EventEmitter<void>();

  themeOptions = options;
  isSidebarOpen = true;

  name = '';
  email = '';
  company_logo = '';
  appDomain: string = '';

  publisherData?: PublisherData; // ✅ optional

  public selectedLanguage: any = {
    language: 'English',
    code: 'en',
    type: 'US',
    icon: 'us',
  };

  public languages: any[] = [
    { language: 'English', code: 'en', type: 'US', icon: 'us' },
    { language: 'Español', code: 'es', icon: 'es' },
    { language: 'Français', code: 'fr', icon: 'fr' },
    { language: 'German', code: 'de', icon: 'de' },
  ];

  constructor(
    private modalService: NgbModal,
    private translate: TranslateService,
    private authService: AuthenticationService,
    private publisherService: PublisherService,
    private networkService: NetworkService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.appDomain = this.networkService.domain;

    //  FIX: call method properly
    const currentUser = this.authService.getUserDetails;

    console.log('currentUser -> ', currentUser);

    const publisherId = currentUser?.userDetail?.id;

    if (publisherId) {
      this.getPublisher(publisherId);
    }
    this.email = currentUser?.email ;
    this.name = currentUser?.first_name;
    console.log(" email -> ", this.email );
    console.log(" name -> ", this.name );
  }

  toggleSidebarState() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.toggleSidebar.emit();
  }

  changeLanguage(lang: any) {
    this.translate.use(lang.code);
    this.selectedLanguage = lang;
  }

  getPublisher(id: string) {
    this.publisherService.getPublisher(id).subscribe({
      next: (result: any) => {
        if (!result?.err && result?.payload) {
          const { email = '', first_name = '', company_logo = '' } = result.payload;

          this.publisherData = result.payload;
          this.email = email;
          this.name = first_name;
          this.company_logo = company_logo;

          console.log('publisherData ->', this.publisherData);
          console.log('email ->', this.email);
          console.log('name ->', this.name);
        }
      },
      error: (err) => {
        console.error('Publisher API Error:', err);
      }
    });
  }

  logout() {
    this.authService.logout();
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