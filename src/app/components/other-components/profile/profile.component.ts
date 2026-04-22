import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NetworkService } from 'src/app/services/network.service';
import { PublisherService } from 'src/app/services/publisher.service';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { PublisherData, PublisherFinanceDetails } from 'src/app/shared/model/profile.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Country } from 'country-state-city';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  publisherDataload = false;

  userData: any;
  appDomain: any;
  company_name: any;
  company_logo: any;
  publisherData!: PublisherData;
  editFinance: PublisherFinanceDetails = {};
  editPublisher: PublisherData = {
    pid: 0,
    name: '',
    company: '',
    email: '',
    phone: '',
    status: '',
    address: {},
    fD: {}
  };
  constructor(
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.userData = this.authService.getUserDetails;
    console.log("userData", this.userData['userDetail']);


  }
}

