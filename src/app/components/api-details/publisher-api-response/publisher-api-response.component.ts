import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PublisherService } from 'src/app/services/publisher.service';

@Component({
  selector: 'app-publisher-api-response',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, CommonModule],
  templateUrl: './publisher-api-response.component.html',
  styleUrl: './publisher-api-response.component.scss'
})
export class PublisherApiResponseComponent implements OnInit {
  getOffersForm: FormGroup;
  @Input() secretKey = '';
  @Input() apiKey = '';
  @Input() offerType = 'all';
  @Input() domain: string = '';
  isSubmitted = false;
  apiResponse = {};
  isCopied: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private publisherService: PublisherService
  ) { }

  ngOnInit(): void {
    this.getOffersForm = this.formBuilder.group({
      limit: ['5'],
      page: ['1'],
      secretkey: [this.secretKey],
      apikey: [this.apiKey],
      offer_type: [''],
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    let data = {
      limit: this.getOffersForm.controls['limit'].value,
      page: this.getOffersForm.controls['page'].value,
      secretkey: this.getOffersForm.controls['secretkey'].value,
      apikey: this.getOffersForm.controls['apikey'].value,
    };
    if (this.getOffersForm.controls['offer_type'].value) {
      data['offer_type'] = this.getOffersForm.controls['offer_type'].value
    }
    this.publisherService.getOffers(data,this.domain).subscribe(response => {
      this.apiResponse = response;
      // console.log("api res",this.apiResponse);
    },
      error => {
        this.toastrService.error('Something Went Wrong, Please Try Again.', 'Error!');
      });
  }

  // copy() {
  //   let selection = window.getSelection();
  //   let range = document.createRange();
  //   range.selectNode(document.getElementById("response-data"));
  //   selection.removeAllRanges();
  //   selection.addRange(range);
  //   document.execCommand("copy");
  //   this.toastrService.success('Response copied successfully.', 'Success!');
  // }
  copy() {

    let selection = window.getSelection();
    let range = document.createRange();
    range.selectNode(document.getElementById("response-data"));
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand("copy");

    this.toastrService.success('Response copied successfully.', 'Success!');

    this.isCopied = true;
    setTimeout(() => {
      this.isCopied = false;
    }, 2000);
  }



}
