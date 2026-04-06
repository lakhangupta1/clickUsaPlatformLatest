import { Component, OnInit } from '@angular/core';
import { NgbAccordionModule, NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { PublisherApiResponseComponent } from "../publisher-api-response/publisher-api-response.component";
import { IModal, ModalType, Size } from 'src/app/shared/model/model/model.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { PublisherService } from 'src/app/services/publisher.service';
import { ConfirmModelComponent } from 'src/app/shared/model/confirm-model/confirm-model.component';
import { creative, deviceTargeting, docParameters, geoTargeting, payloadData, responseData } from 'src/app/shared/model/api-detail.model'
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ApiResponse {
  payload: {
    company?: any;
    api_details?: any;
  };
  err?: string;
}

export interface ApiData {
  id?: number;
  company?: any;
  api_details?: any;
  domain: any;

}
@Component({
  selector: 'app-publisher-api-details',
  standalone: true,
  imports: [NgbNavModule, NgbAccordionModule, CommonModule, PublisherApiResponseComponent],
  templateUrl: './publisher-api-details.component.html',
  styleUrl: './publisher-api-details.component.scss'
})
export class PublisherApiDetailsComponent implements OnInit {
  apiData = {};
  id = this.route.snapshot.params['id'];
  public modal: IModal;
  public modals: any;
  allOffersURL = '';
  activeOffersURL = '';
  publicOffersURL = '';
  privateOffersURL = '';
  workingOffersURL = '';
  activeIdHorizontal = '1';
  activeIdVertical = '1';
  baseUrl :any;
  apiStaticDoc = docParameters;
  responseStaticDoc = responseData;
  responsePayloadData = payloadData;
  responseGeoTargetingData = geoTargeting;
  responseDeviceTargetingData = deviceTargeting;
  responseCreativeData = creative;
  host: any;
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private modalService: NgbModal,
    public authenticationService: AuthenticationService,
    private toastrService: ToastrService,
    private publisherService: PublisherService
  ) {
    if (!this.id) {
      this.id = this.authenticationService.getUserDetails.userDetail.parentId[0];
    }
    if (!this.id) {
      this.id = "";
    }

    // this.host = window.location;
    // console.log("url--",this.host);
    // this.allOffersURL = this.authenticationService.getSubDomain() + '/publisher/offers/all';
    // this.activeOffersURL = this.authenticationService.getSubDomain() + '/publisher/offers/active';
    // this.publicOffersURL = this.authenticationService.getSubDomain() + '/publisher/offers/public';
    // this.privateOffersURL = this.authenticationService.getSubDomain() + '/publisher/offers/private';
    // this.baseUrl = this.authenticationService.getSubDomain() + '/publisher/offers/v2';
    // this.workingOffersURL = this.authenticationService.getSubDomain() + '/publisher/offers/working';
  }

  ngOnInit(): void {
    this.modal = {
      title: '',
      body: '',
      style: {
        centered: true,
        size: Size.lg,
        scrollable: true
      },
      type: ModalType.Basic,
      backdropClass: 'light-blue-backdrop',
      windowClass: 'dark-modal',
      hideCloseButton: true,
      closeOnOutsideClick: false,
      animation: true,
      keyboard: false
    };
    this.modals = {
      style: {
        centered: true,
        size: Size.lg,
        scrollable: true
      }
    };
    this.publisherService.createApiCredentials(this.id).subscribe((result: ApiResponse) => {
      if (result.err) {
        this.toastrService.error('Publisher not found.', 'Error!');
      } else if (result.payload && (result.payload.company || result.payload.api_details)) {
        this.apiData = result.payload;
        // console.log("apiData",this.apiData);
        // console.log("apiData",result.payload.api_details);
        this.baseUrl = `https://${result.payload['domain']}/publisher/offers/v2`;
        this.allOffersURL = `https://${result.payload['domain']}/publisher/offers/all`;
        this.activeOffersURL = `https://${result.payload['domain']}/publisher/offers/active`;
        this.publicOffersURL = `https://${result.payload['domain']}/publisher/offers/public`;
        this.privateOffersURL = `https://${result.payload['domain']}/publisher/offers/private`;
        this.workingOffersURL = `https://${result.payload['domain']}/publisher/offers/working`;
        // console.log("domain", this.baseUrl);

      } else {
        this.toastrService.error('Publisher Not Found.', 'Error!');
      }
    },
      error => {
        this.toastrService.error('Something Went Wrong, Please Try Again.', 'Error!');
      });
  }

  updateApikey(id) {
    this.modal.title = "Confirmation";
    this.modal.body = 'Are you sure you want to Update your Api_key..?';
    this.modal.type = ModalType.Confirm;
    const modalRef = this.modalService.open(ConfirmModelComponent, {
      centered: true,
      size: Size.lg,
      scrollable: true
    });

    modalRef.componentInstance.modal = this.modal;

    modalRef.result.then((response) => {
      if (response === 'true') {
        this.publisherService.updateApiCredentials(id).subscribe((result: ApiResponse) => {
          if (result?.payload?.company || result?.payload?.api_details) {
            this.apiData = result.payload;
          } else {
            this.toastrService.error('Publisher Not Found.', 'Error!');
          }
        }, () => {
          this.toastrService.error('Something Went Wrong, Please Try Again.', 'Error!');
        });
      }
    }).catch(() => {

    });
  }
  // PDF format data download code

  // generatePDF() {
  //   const doc = new jsPDF();

  //   // watermark
  //   doc.setFontSize(40);
  //   doc.setTextColor(150, 150, 150);  
  //   doc.setTextColor(150, 150, 150, 0.4); 



  //   doc.text("WATERMARK", doc.internal.pageSize.getWidth() / 2,
  //     doc.internal.pageSize.getHeight() / 2, {
  //     align: "center",
  //     angle: -45
  //   });

  //   doc.setFontSize(12);

  //   // water mark end

  //   doc.setFont('helvetica', 'bold');

  //   doc.text('Request URL:', 10, 10);
  //   doc.setFont('helvetica', 'normal');
  //   doc.text(`${this.baseUrl}`, 50, 10);

  //   doc.setFont('helvetica', 'bold');
  //   doc.text('Request Method:', 10, 20);
  //   doc.setFont('helvetica', 'normal');
  //   doc.text('GET', 60, 20);

  //   doc.setFont('helvetica', 'bold');
  //   doc.text('Request Parameters:', 10, 30);
  //   doc.setFont('helvetica', 'normal');

  //   let finalY = 35;
  //   autoTable(doc, {
  //     startY: finalY,
  //     head: [['Key', 'Type', 'Require', 'Format', 'Description', 'Example']],
  //     body: this.apiStaticDoc.map(item => [
  //       item.key, item.type, item.require, item.format, item.description, (item.key.toLowerCase() === 'secretkey' || item.key.toLowerCase() === 'apikey') ? item.example.slice(0, 10) + 'xxxxx' : item.example
  //     ])
  //   });
  //   finalY = (doc as any).lastAutoTable.finalY + 10;

  //   doc.setFont('helvetica', 'bold');
  //   doc.text('Response Keys:', 10, finalY);
  //   doc.setFont('helvetica', 'normal');

  //   autoTable(doc, {
  //     startY: finalY + 5,
  //     head: [['Key', 'Format', 'Description', 'Example']],
  //     body: this.responseStaticDoc.map(item => [
  //       item.key, item.format, item.description, item.example
  //     ])
  //   });
  //   finalY = (doc as any).lastAutoTable.finalY + 10;

  //   doc.setFont('helvetica', 'bold');
  //   doc.text('Payload:', 10, finalY);
  //   doc.setFont('helvetica', 'normal');

  //   autoTable(doc, {
  //     startY: finalY + 5,
  //     head: [['Key', 'Format', 'Description', 'Example']],
  //     body: this.responsePayloadData.map(item => [
  //       item.key, item.format, item.description, item.example
  //     ]),
  //     columnStyles: {
  //       0: { cellWidth: 30 },
  //       1: { cellWidth: 20 },
  //       2: {
  //         cellWidth: 30,
  //         valign: 'middle',
  //         overflow: 'linebreak',
  //       },
  //       3: {
  //         cellWidth: 'auto',
  //         valign: 'middle',
  //         overflow: 'linebreak',
  //       },
  //     }
  //   });
  //   finalY = (doc as any).lastAutoTable.finalY + 10;

  //   doc.setFont('helvetica', 'bold');
  //   doc.text('Geo Targeting:', 10, finalY);
  //   doc.setFont('helvetica', 'normal');

  //   autoTable(doc, {
  //     startY: finalY + 5,
  //     head: [['Key', 'Format', 'Description', 'Example']],
  //     body: this.responseGeoTargetingData.map(item => [
  //       item.key, item.format, item.description, item.example
  //     ])
  //   });
  //   finalY = (doc as any).lastAutoTable.finalY + 10;

  //   doc.setFont('helvetica', 'bold');
  //   doc.text('Device Targeting:', 10, finalY);
  //   doc.setFont('helvetica', 'normal');

  //   autoTable(doc, {
  //     startY: finalY + 5,
  //     head: [['Key', 'Format', 'Description', 'Example']],
  //     body: this.responseDeviceTargetingData.map(item => [
  //       item.key, item.format, item.description, item.example
  //     ])
  //   });
  //   finalY = (doc as any).lastAutoTable.finalY + 10;

  //   doc.setFont('helvetica', 'bold');
  //   doc.text('Creative:', 10, finalY);
  //   doc.setFont('helvetica', 'normal');

  //   autoTable(doc, {
  //     startY: finalY + 5,
  //     head: [['Key', 'Format', 'Description', 'Example']],
  //     body: this.responseCreativeData.map(item => [
  //       item.key, item.format, item.description, item.example
  //     ]),
  //     columnStyles: {
  //       0: { cellWidth: 30 },
  //       1: { cellWidth: 20 },
  //       2: {
  //         cellWidth: 30,
  //         valign: 'middle',
  //         overflow: 'linebreak',
  //       },
  //       3: {
  //         cellWidth: 'auto',
  //         valign: 'middle',
  //         overflow: 'linebreak',
  //       },
  //     }
  //   });

  //   // Save the PDF
  //   doc.save('API_Documention.pdf');
  //   this.toastrService.success("API_Documention Download Successfully..");
  // }

  generatePDF() {
    const doc = new jsPDF();
    const fullname = window.location.host;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();


    const drawWatermark = () => {


      doc.setFontSize(40);
      doc.setTextColor(0, 0, 0, 0.6);
      doc.text(fullname, pageWidth / 2, pageHeight / 2, {
        align: "center",
        angle: -45
      });
    };

    (doc as any).autoTableSetDefaults({
      willDrawPage: (data) => {
        drawWatermark();
      }
    });


    doc.setFontSize(12);

    doc.setFont('helvetica', 'bold');
    doc.text('Request URL:', 10, 10);

    doc.setFont('helvetica', 'normal');
    doc.text(`${this.baseUrl}`, 50, 10);

    doc.setFont('helvetica', 'bold');
    doc.text('Request Method:', 10, 20);

    doc.setFont('helvetica', 'normal');
    doc.text('GET', 60, 20);

    doc.setFont('helvetica', 'bold');
    doc.text('Request Parameters:', 10, 30);

    doc.setFont('helvetica', 'normal');
    let finalY = 35;

    autoTable(doc, {
      startY: finalY,
      head: [['Key', 'Type', 'Require', 'Format', 'Description', 'Example']],
      body: this.apiStaticDoc.map(item => [
        item.key,
        item.type,
        item.require,
        item.format,
        item.description,
        (item.key.toLowerCase() === 'secretkey' || item.key.toLowerCase() === 'apikey')
          ? item.example.slice(0, 10) + 'xxxxx'
          : item.example
      ])
    });
    finalY = (doc as any).lastAutoTable.finalY + 10;


    doc.setFont('helvetica', 'bold');
    doc.text('Response Keys:', 10, finalY);
    doc.setFont('helvetica', 'normal');

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Key', 'Format', 'Description', 'Example']],
      body: this.responseStaticDoc.map(item => [
        item.key, item.format, item.description, item.example
      ])
    });
    finalY = (doc as any).lastAutoTable.finalY + 10;


    doc.setFont('helvetica', 'bold');
    doc.text('Payload:', 10, finalY);
    doc.setFont('helvetica', 'normal');

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Key', 'Format', 'Description', 'Example']],
      body: this.responsePayloadData.map(item => [
        item.key, item.format, item.description, item.example
      ]),
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 20 },
        2: { cellWidth: 30, overflow: 'linebreak' },
        3: { cellWidth: 'auto', overflow: 'linebreak' }
      }
    });
    finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Geo Targeting:', 10, finalY);
    doc.setFont('helvetica', 'normal');

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Key', 'Format', 'Description', 'Example']],
      body: this.responseGeoTargetingData.map(item => [
        item.key, item.format, item.description, item.example
      ])
    });
    finalY = (doc as any).lastAutoTable.finalY + 10;


    doc.setFont('helvetica', 'bold');
    doc.text('Device Targeting:', 10, finalY);
    doc.setFont('helvetica', 'normal');

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Key', 'Format', 'Description', 'Example']],
      body: this.responseDeviceTargetingData.map(item => [
        item.key, item.format, item.description, item.example
      ])
    });
    finalY = (doc as any).lastAutoTable.finalY + 10;


    doc.setFont('helvetica', 'bold');
    doc.text('Creative:', 10, finalY);
    doc.setFont('helvetica', 'normal');

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Key', 'Format', 'Description', 'Example']],
      body: this.responseCreativeData.map(item => [
        item.key, item.format, item.description, item.example
      ]),
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 20 },
        2: { cellWidth: 30, overflow: 'linebreak' },
        3: { cellWidth: 'auto', overflow: 'linebreak' }
      }
    });


    doc.save('API_Documentation.pdf');
    this.toastrService.success("API Documentation Downloaded Successfully.");
  }

  openDownloadModal(content: any) {
    this.modalService.open(content, { centered: true, size: 'md' });
  }
}
