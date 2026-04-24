import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { NotifierModule, NotifierService } from 'angular-notifier';
import { Globalconstant } from 'src/app/const/global';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,   // ✅ IMPORTANT
    NotifierModule,
    NgbTooltip
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent implements OnInit {

  userEditForm!: FormGroup;
  userId: string = '';
  showPassword: boolean = false;
  countryList: any[] = [];
  currency: any[] = [];

  constructor(
    private notifier: NotifierService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.countryList = Globalconstant.config.country || [];
    this.currency = Globalconstant.config.currency || [];
    console.log(" this.countryList -> ", this.countryList );
    console.log(" this.currency -> ", this.currency );
  }

  ngOnInit(): void {

    this.userId = this.route.snapshot.paramMap.get('id') || '';

    // FORM INIT
    this.userEditForm = this.fb.group({
      company: [''],
      first_name: ['', Validators.required],
      last_name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: [''], // optional in edit
      phone: [''], // Validators.pattern(/^[A-Z]{3}$/) // indian currency Validators.pattern("^[6-9][0-9]{9}$") 
      country: ['', Validators.required],
      currency: ['INR'],
      status : ['active'],
      // PROFILE (nested)
      profile: this.fb.group({
        address: [''],
        state: [''],
        pincode: [''],
        pay_type: [''],
        upi: [''],
        paypal: [''],
        paytm: [''],

        bank: this.fb.group({
          account_holder_name: [''],
          account_number: [''],
          ifsc_code: [''],
          bank_name: ['']
        })
      })
    });

    // EDIT MODE
    if (this.userId) {
      this.getUser();
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  // GET USER
  getUser() {
    this.userService.getUserById(this.userId).subscribe({
      next: (res: any) => {
        if (!res.err) {

          const data = res.payload;
          console.log(" data from db -> ", data );
          // PATCH FORM
          this.userEditForm.patchValue({
            company: data.company,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            status : data?.status,
            country: data?.country,
            currency: data?.currency,
            phone: data.profile?.phone,

            profile: {
              address: data?.profile?.address,
              state: data?.profile?.state,
              pincode: data?.profile?.pincode,
              pay_type: data?.profile?.pay_type,
              upi: data?.profile?.upi,
              paypal: data?.profile?.paypal,
              paytm: data?.profile?.paytm,

              bank: {
                account_holder_name: data?.profile?.bank?.account_holder_name,
                account_number: data?.profile?.bank?.account_number,
                ifsc_code: data?.profile?.bank?.ifsc_code,
                bank_name: data?.profile?.bank?.bank_name
              }
            }
          });

          this.notifier.notify('success', 'User loaded');

        } else {
          this.notifier.notify('error', 'User not found');
        }
      },
      error: () => {
        this.notifier.notify('error', 'Something went wrong');
      }
    });
  }

  // SUBMIT (CREATE / UPDATE)
  onSubmit() {

    if (this.userEditForm.invalid) {
      this.userEditForm.markAllAsTouched();
      return;
    }

    const payload = this.userEditForm.value;

    // REMOVE PASSWORD IF EMPTY (EDIT CASE)
    if (!payload.password) {
      delete payload.password;
    }

    if (this.userId) {
      // 🔹 UPDATE
      console.log(" userId -> ", this.userId );
      console.log(" on submit payload -> ", payload );
      this.userService.updateUser(this.userId, payload).subscribe({
        next: (res: any) => {
          if (!res.err) {
            this.toaster.success('User updated');
            this.router.navigate(['/user/details', this.userId]);
          } else {
            this.toaster.error('Update failed');
          }
        },
        error: () => this.toaster.error('Server error')
      });

    } else {
      // 🔹 CREATE
      console.log(" create user payload -> ", payload );
      this.userService.createUser(payload).subscribe({
        next: (res: any) => {
          if (!res.err) {
            this.toaster.success(res?.msg);
            this.router.navigate(['/list/user']);
          } else {
            this.toaster.error(res?.msg);
          }
        },
        error: () => this.toaster.error('Server error')
      });
    }
  }

  getError(controlName: string): string {
    const control = this.userEditForm.get(controlName);

    if (!control || !control.touched || !control.errors) return '';

    if (control.errors['required']) return 'This field is required';
    if (control.errors['email']) return 'Invalid email format';
    if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} characters required`;
    if (control.errors['pattern']) return 'Invalid format';
    if (control.errors['invalidCurrency']) return 'Invalid currency selected';

    return 'Invalid value';
  }
}