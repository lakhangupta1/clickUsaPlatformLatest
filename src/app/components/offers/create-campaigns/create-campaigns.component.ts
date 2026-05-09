import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MultiselectedComponent } from 'src/app/shared/multiselected/multiselected.component';
import { ActivatedRoute, Router } from '@angular/router';
import { OffersService } from 'src/app/services/offers.service';
import { Globalconstant } from 'src/app/const/global';

@Component({
  selector: 'app-create-campaigns',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MultiselectedComponent],
  templateUrl: './create-campaigns.component.html',
  styleUrls: ['./create-campaigns.component.scss']
})
export class CreateCampaignsComponent implements OnInit {

  campaignForm!: FormGroup;
  campaignId: string | null = null;
  isEditMode = false;
  multiConfigCountryAllow: any = {};
  // countryList = config.country.map((x) => Object.assign({}, x));
  countryList = Globalconstant.config.country;
  // Tier 1 groups (country keys)
  engTier1Keys = ['AU', 'CA', 'NZ', 'GB', 'US'];
  intlTier1Keys = ['AU','AT','BE','CA','DK','FI','FR','DE','IT','LU','NL','NZ','NO','ES','SE','CH','GB','US'];

  // display list includes special quick-select options on top
  get displayCountryList() {
    const specials = [
      { key: '__eng_t1', value: 'Select English Tier 1 Countries' },
      { key: '__intl_t1', value: 'Select International Tier 1 Countries' }
    ];
    return [...specials, ...(this.countryList || [])]; 
  }
  
  clickListItems = [ 
    { clicks : 0, target : 0 },
    { clicks : 50, target : 100 },
    { clicks : 100, target : 200 },
    { clicks : 150, target : 300 } 
  ]
  selectedItem: any = null;
  dropdownSettings: any = {
    idField: 'id',
    textField: 'text',
    allowSearchFilter: true,
    itemsShowLimit: 3,
    maxHeight: 200
  };

  countryDropdownSettings: any = {
    idField: 'key',
    textField: 'value',
    allowSearchFilter: true,
    itemsShowLimit: 5,
    maxHeight: 300
  };
  verticalList = [
    'Make Money Online',
    'Health',
    'Weight Loss'
  ];
  tagList = [
    { id: 'email', text: 'email' },
    { id: 'clicksengaged', text: 'clicksengaged' },
    { id: 'clicksexcess', text: 'clicksexcess' },
    { id: 'clicksfacebook', text: 'clicksfacebook' },
    { id: 'adsfunnel', text: 'adsfunnel' },
    { id: 'clicksinjectedinstagram', text: 'clicksinjectedinstagram' },
    { id: 'reel', text: 'reel' },
    { id: 'clicksmedia-buysmixed', text: 'clicksmedia-buysmixed' },
    { id: 'clicksnotification', text: 'clicksnotification' },
    { id: 'clicksnurtured', text: 'clicksnurtured' },
    { id: 'clickstiktok', text: 'clickstiktok' },
    { id: 'bio', text: 'bio' },
    { id: 'clicksyoutube', text: 'clicksyoutube' },
    { id: 'description', text: 'description' },
    { id: 'clicks', text: 'clicks' }
  ];
  Block_deviceList = [
    { id: 'n/a', text: 'n/a' },
    { id: 'Desktop', text: 'Desktop' },
    { id: 'Smartphone', text: 'Smartphone' },
    { id: 'Tablet', text: 'Tablet' }
  ];
  allow_deviceList = [
    // { id: 'n/a', text: 'n/a' },
    { id: 'Desktop', text: 'Desktop' },
    { id: 'Smartphone', text: 'Smartphone' },
    { id: 'Tablet', text: 'Tablet' }
  ];
  Block_osList = [
    { id: 'n/a', text: 'n/a' },
    { id: 'Android', text: 'Android' },
    { id: 'iOS', text: 'iOS' },
    { id: 'Mac', text: 'Mac' }
  ];
  Allow_osList = [
    // { id: 'n/a', text: 'n/a' },
    { id: 'Android', text: 'Android' },
    { id: 'iOS', text: 'iOS' },
    { id: 'Mac', text: 'Mac' },
    { id: 'Windows', text: 'Windows' },
    { id: 'Chrome OS', text: 'Chrome OS' },
    { id: 'GNU/Linux', text: 'GNU/Linux' },
    { id: 'Unix', text: 'Unix' }
  ];
  providerList = [
    { id: 1, text: 'Brandon Sean' },
    { id: 2, text: 'Chris Harter' },
    { id: 3, text: 'Corey Lewis' },
    { id: 4, text: 'Domantas Vagonis' },
    { id: 5, text: 'Will Tseng' },
    { id: 6, text: 'Wilfred Bakker' },
    { id: 7, text: 'AJ Simon' },
    { id: 8, text: 'Brad Kellard' },
    { id: 9, text: 'Gabe Salome' },
    { id: 10, text: 'Edgars Skujins' },
    { id: 11, text: 'Glenn Fedoruk (LeadHero)' },
    { id: 12, text: 'Greg Prouse' },
    { id: 13, text: 'Hamsa Hassan' },
    { id: 14, text: 'Igor Varoscic' },
    { id: 15, text: 'Indulis Staskevics' },
    { id: 16, text: 'Ivo Polic' },
    { id: 17, text: 'Jason Giusto' },
    { id: 18, text: 'Jasdeep Singh Jandu' }
  ];
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private campaignService: OffersService
  ) {}

  ngOnInit(): void {
    console.log(" countryList -> ", this.countryList );
    // Form Init
    this.campaignForm = this.fb.group({
      camp_name: [''],
      destination_url: [''],
      schedule_start: [''],
      schedule_end: [''],

      allow_traffic: this.fb.group({
        vartical: [''],
        provider: [[]],
        country: [[]],
        device: [[]],
        os: [[]],
        tag: [[]]
      }),

      blocked_traffic: this.fb.group({
        provider: [[]],
        country: [[]],
        device: [[]],
        os: [[]],
        tag: [[]]
      }),

      budget: this.fb.group({
        cpc: [''],
        total: [''],
        daily: [''],
        smooth: [false],
        acceleration: [false]
      }),
      clicks : [0],
      target : [0],
      status: ['active']
    });

    // Check Edit Mode
    this.campaignId = this.route.snapshot.paramMap.get('id');

    if (this.campaignId) {
      this.isEditMode = true;
      this.getCampaignById();
    }
  }

  configForGeoTargeting(){
    this.multiConfigCountryAllow = {
      dropdownList: this.countryList,
      idField: 'key',
      textField: 'value',
      selectedItems: this.offerGeoControl.country_allow.value,
      placeholder: 'Select Countries',
      itemsShowLimit: 3,
      maxHeight: 150,
    };
  }

  get offerGeoControl() {
    return this.campaignForm.controls['allow_traffic']['country']['controls'];
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
        const data = res.payload;
        data.schedule_start = this.formatDate(data.schedule_start);
        data.schedule_end = this.formatDate(data.schedule_end);

        const normalizeToArray = (v: any) => {
          if (v == null) return [];
          if (Array.isArray(v)) return v;
          if (typeof v === 'string') return v.split(',').map((s: string) => s.trim()).filter(Boolean);
          if (typeof v === 'object') return [v];
          return [v];
        };

        // Ensure allow_traffic and blocked_traffic exist
        data.allow_traffic = data.allow_traffic || {};
        data.blocked_traffic = data.blocked_traffic || {};

        // Normalize providers to objects matching providerList when possible
        data.allow_traffic.provider = normalizeToArray(data.allow_traffic.provider).map((item: any) => {
          if (item == null) return null;
          if (typeof item === 'string') return this.providerList.find(p => p.text === item) || { id: null, text: item };
          if (typeof item === 'number') return this.providerList.find(p => p.id === item) || { id: item, text: String(item) };
          if (item && item.text) return item;
          return item;
        }).filter(Boolean);

        // Normalize countries to objects from countryList when possible
        data.allow_traffic.country = normalizeToArray(data.allow_traffic.country).map((item: any) => {
          if (item == null) return null;
          if (typeof item === 'string') return this.countryList.find((c: any) => c.key === item) || { key: item, value: item };
          if (item && item.key) return item;
          return item;
        }).filter(Boolean);

        // Normalize devices to objects from deviceList when possible
        data.allow_traffic.device = normalizeToArray(data.allow_traffic.device).map((item: any) => {
          if (item == null) return null;
          if (typeof item === 'string') return this.allow_deviceList.find((d: any) => d.id === item || d.text === item) || { id: item, text: item };
          if (item && item.id) return item;
          return item;
        }).filter(Boolean);

        // Normalize OS to objects from osList when possible
        data.allow_traffic.os = normalizeToArray(data.allow_traffic.os).map((item: any) => {
          if (item == null) return null;
          if (typeof item === 'string') return this.Allow_osList.find((o: any) => o.id === item || o.text === item) || { id: item, text: item };
          if (item && item.id) return item;
          return item;
        }).filter(Boolean);

        // Normalize tags to objects when possible
        data.allow_traffic.tag = normalizeToArray(data.allow_traffic.tag).map((item: any) => {
          if (item == null) return null;
          if (typeof item === 'string') return this.tagList.find((t: any) => t.id === item || t.text === item) || { id: item, text: item };
          if (item && item.id) return item;
          return item;
        }).filter(Boolean);

        data.blocked_traffic.provider = normalizeToArray(data.blocked_traffic.provider).map((item: any) => {
          if (item == null) return null;
          if (typeof item === 'string') return this.providerList.find(p => p.text === item) || { id: null, text: item };
          if (typeof item === 'number') return this.providerList.find(p => p.id === item) || { id: item, text: String(item) };
          if (item && item.text) return item;
          return item;
        }).filter(Boolean);

        data.blocked_traffic.country = normalizeToArray(data.blocked_traffic.country).map((item: any) => {
          if (item == null) return null;
          if (typeof item === 'string') return this.countryList.find((c: any) => c.key === item) || { key: item, value: item };
          if (item && item.key) return item;
          return item;
        }).filter(Boolean);

        data.blocked_traffic.device = normalizeToArray(data.blocked_traffic.device).map((item: any) => {
          if (item == null) return null;
          if (typeof item === 'string') return this.Block_deviceList.find((d: any) => d.id === item || d.text === item) || { id: item, text: item };
          if (item && item.id) return item;
          return item;
        }).filter(Boolean);

        data.blocked_traffic.os = normalizeToArray(data.blocked_traffic.os).map((item: any) => {
          if (item == null) return null;
          if (typeof item === 'string') return this.Block_osList.find((o: any) => o.id === item || o.text === item) || { id: item, text: item };
          if (item && item.id) return item;
          return item;
        }).filter(Boolean);

        data.blocked_traffic.tag = normalizeToArray(data.blocked_traffic.tag).map((item: any) => {
          if (item == null) return null;
          if (typeof item === 'string') return this.tagList.find((t: any) => t.id === item || t.text === item) || { id: item, text: item };
          if (item && item.id) return item;
          return item;
        }).filter(Boolean);

        // patch form
        this.campaignForm.patchValue(data);
      }
    });
  }

  onSelect(event: any) {
    const value = event.target.value;

    if (!value) return;

    const [clicks, target] = value.split('-').map(Number);

    this.campaignForm.patchValue({
      clicks,
      target
    });
  }

  onAllowProviderChange(selected: any[]) {
    this.campaignForm.get('allow_traffic.provider')?.setValue(selected || []);
  }

  onBlockedProviderChange(selected: any[]) {
    this.campaignForm.get('blocked_traffic.provider')?.setValue(selected || []);
  }

  onAllowDeviceChange(selected: any[]) {
    this.campaignForm.get('allow_traffic.device')?.setValue(selected || []);
  }

  onBlockedDeviceChange(selected: any[]) {
    this.campaignForm.get('blocked_traffic.device')?.setValue(selected || []);
  }

  onAllowOsChange(selected: any[]) {
    this.campaignForm.get('allow_traffic.os')?.setValue(selected || []);
  }

  onBlockedOsChange(selected: any[]) {
    this.campaignForm.get('blocked_traffic.os')?.setValue(selected || []);
  }

  onAllowCountryChange(selected: any[]) {
    const merged = this._expandSpecialCountries(selected || []);
    this.campaignForm.get('allow_traffic.country')?.setValue(merged);
  }

  onAllowTagChange(selected: any[]) {
    this.campaignForm.get('allow_traffic.tag')?.setValue(selected || []);
  }

  onBlockedCountryChange(selected: any[]) {
    const merged = this._expandSpecialCountries(selected || []);
    this.campaignForm.get('blocked_traffic.country')?.setValue(merged);
  }

  onBlockedTagChange(selected: any[]) {
    this.campaignForm.get('blocked_traffic.tag')?.setValue(selected || []);
  }

  private _expandSpecialCountries(selected: any[]) {
    const sel = Array.isArray(selected) ? selected : [];

    // Remove special markers from base selection (we don't want '__...' items selected)
    const base = sel.filter((s: any) => s && !(s.key && (s.key as string).startsWith('__')));

    const addByKeys = (keys: string[]) => keys.map(k => this.countryList.find((c: any) => c.key === k)).filter(Boolean as any);

    let additions: any[] = [];
    if (sel.some((s: any) => s && s.key === '__eng_t1')) additions = additions.concat(addByKeys(this.engTier1Keys));
    if (sel.some((s: any) => s && s.key === '__intl_t1')) additions = additions.concat(addByKeys(this.intlTier1Keys));

    // merge unique by key and return only country objects (no special markers)
    const countryMap: Record<string, any> = {};
    base.concat(additions).forEach((c: any) => { if (c && c.key) countryMap[c.key] = c; });
    return Object.values(countryMap);
  }
  
  // Submit
  onSubmit(event?: Event) {
    if (event) event.preventDefault();
    console.log(this.selectedItem);

    let formData = this.campaignForm.value;
    console.log(" formData ", formData );
    // FIX TYPES + transform selections for backend
    const extractCountryKeys = (arr: any[]) => (arr || []).map(i => i && (i.key ?? i.value ?? i)).filter(Boolean);
    const extractProviderTexts = (arr: any[]) => (arr || []).map(i => i && (i.text ?? i.name ?? i)).filter(Boolean);
    const extractDeviceNames = (arr: any[]) => (arr || []).map(i => i && (i.text ?? i.id ?? i)).filter(Boolean);
    const extractOsNames = (arr: any[]) => (arr || []).map(i => i && (i.text ?? i.id ?? i)).filter(Boolean);
    const extractTagNames = (arr: any[]) => (arr || []).map(i => i && (i.text ?? i.id ?? i)).filter(Boolean);

    const allowTraffic = {
      ...(formData.allow_traffic || {}),
      country: extractCountryKeys(formData.allow_traffic?.country),
      provider: extractProviderTexts(formData.allow_traffic?.provider),
      device: extractDeviceNames(formData.allow_traffic?.device),
      os: extractOsNames(formData.allow_traffic?.os),
      tag: extractTagNames(formData.allow_traffic?.tag)
    };

    const blockedTraffic = {
      ...(formData.blocked_traffic || {}),
      country: extractCountryKeys(formData.blocked_traffic?.country),
      provider: extractProviderTexts(formData.blocked_traffic?.provider),
      device: extractDeviceNames(formData.blocked_traffic?.device),
      os: extractOsNames(formData.blocked_traffic?.os),
      tag: extractTagNames(formData.blocked_traffic?.tag)
    };

    const payload = {
      ...formData,
      allow_traffic: allowTraffic,
      blocked_traffic: blockedTraffic,

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

    // Trim all string values in the payload (including nested)
    const trimAllStrings = (v: any): any => {
      if (v == null) return v;
      if (typeof v === 'string') return v.trim();
      if (v instanceof Date) return v;
      if (Array.isArray(v)) return v.map(item => trimAllStrings(item));
      if (typeof v === 'object') {
        const out: any = {};
        for (const k of Object.keys(v)) {
          out[k] = trimAllStrings(v[k]);
        }
        return out;
      }
      return v;
    };

    const trimmedPayload = trimAllStrings(payload);

    console.log("FINAL PAYLOAD:", trimmedPayload);

    if (this.isEditMode) {
      this.campaignService.updateCampaign(this.campaignId, trimmedPayload).subscribe({
        next: (res: any) => {
          console.log("UPDATE SUCCESS:", res);
          this.router.navigate(['/offers/campaign-list']);
          // this.router.navigate(['/add-payment']);
        },
        error: (err) => {
          console.error("UPDATE ERROR:", err);
        }
      });
    } else {
      this.campaignService.createCampaign(trimmedPayload).subscribe({
        next: () => {
          // this.router.navigate(['/add-payment']);
          this.router.navigate(['/offers/campaign-list']);
        }
      });
    }
  }
}