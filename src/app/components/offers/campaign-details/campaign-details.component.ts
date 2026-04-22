import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OffersService } from 'src/app/services/offers.service';


@Component({
  selector: 'app-campaign-details',
  standalone: true,
  imports: [ CommonModule , RouterModule ],
  templateUrl: './campaign-details.component.html',
  styleUrl: './campaign-details.component.scss'
})
export class CampaignDetailsComponent implements OnInit {
  campaignId: string | null = null;
  campaign: any = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private campaignService: OffersService
  ){

  }
  ngOnInit(): void {
    this.campaignId = this.route.snapshot.paramMap.get('id');
    console.log(" campaignId ", this.campaignId );
    if (this.campaignId) {
      this.getCampaignById();
    }
  }
  getCampaignById(){
    console.log(" ")
    this.campaignService.getCampaignById(this.campaignId).subscribe((res: any) => {
      if (!res.err) {
        console.log(" res caretsf ssg ->............... ", res.payload );        
        this.campaign = res.payload;
      }else{        
      }
    });
  }

  copyLink() {
    navigator.clipboard.writeText(this.campaign.destination_url);
  }

}
