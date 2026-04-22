import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OffersService } from 'src/app/services/offers.service';

@Component({
  selector: 'app-create-campaigns',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-campaigns.component.html',
  styleUrl: './create-campaigns.component.scss'
})
export class CreateCampaignsComponent implements OnInit {

  campaignForm!: FormGroup;
  campaignId: string | null = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private campaignService: OffersService
  ) {}

  ngOnInit(): void {

    // Form Init
    this.campaignForm = this.fb.group({
      camp_name: [''],
      destination_url: [''],
      schedule_start: [''],
      schedule_end: [''],

      allow_traffic: this.fb.group({
        vartical: [''],
        provider: [''],
        country: [''],
        device: [''],
        os: [''],
        tag: ['']
      }),

      blocked_traffic: this.fb.group({
        provider: [''],
        country: [''],
        device: [''],
        os: [''],
        tag: ['']
      }),

      budget: this.fb.group({
        cpc: [''],
        total: [''],
        daily: [''],
        smooth: [false],
        acceleration: [false]
      }),

      status: ['active']
    });

    // Check Edit Mode
    this.campaignId = this.route.snapshot.paramMap.get('id');

    if (this.campaignId) {
      this.isEditMode = true;
      this.getCampaignById();
    }
  }

  formatDate(date: string) {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }
  // Fetch Campaign for Edit
  getCampaignById() {
    this.campaignService.getCampaignById(this.campaignId).subscribe((res: any) => {
      if (!res.err) {
        console.log(" res caretsf ssg ->............... ", res.payload );
        const  data = res.payload
        data.schedule_start = this.formatDate(data.schedule_start);
        data.schedule_end = this.formatDate(data.schedule_end);
        // this.campaignForm.patchValue( res.payload );
        this.campaignForm.patchValue(data);
      }
    });
  }

  // Submit
  onSubmit(event?: Event) {
    if (event) event.preventDefault();

    let formData = this.campaignForm.value;
    console.log(" formData ", formData );
    // FIX TYPES
    const payload = {
      ...formData,

      schedule_start: formData.schedule_start
        ? new Date(formData.schedule_start)
        : null,

      schedule_end: formData.schedule_end
        ? new Date(formData.schedule_end)
        : null,

      budget: {
        ...formData.budget,
        cpc: Number(formData.budget?.cpc) || 0,
        total: Number(formData.budget?.total) || 0,
        daily: Number(formData.budget?.daily) || 0
      }
    };

    console.log("FINAL PAYLOAD:", payload);

    if (this.isEditMode) {
      this.campaignService.updateCampaign(this.campaignId, payload).subscribe({
        next: (res: any) => {
          console.log("UPDATE SUCCESS:", res);
          this.router.navigate(['/offers/campaign-list']);
        },
        error: (err) => {
          console.error("UPDATE ERROR:", err);
        }
      });
    } else {
      this.campaignService.createCampaign(payload).subscribe({
        next: () => {
          this.router.navigate(['/offers/campaign-list']);
        }
      });
    }
  }
}