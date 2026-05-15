import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule
} from '@angular/forms';

import { RouterModule, Router } from '@angular/router';

import { PaymentService } from 'src/app/services/payment.service';

declare var Razorpay: any;

@Component({
  selector: 'app-add-payment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss']
})
export class AddPaymentComponent {

  paymentForm!: FormGroup;

  loading: boolean = false;

  user: any = {
    _id: 'USER_ID',
    name: 'Lakhan Gupta',
    email: 'lakhan@gmail.com',
    mobile: '9999999999'
  };

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private router: Router
  ) {

    this.paymentForm = this.fb.group({

      amount: [
        '',
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      currency: [
        'USD',
        Validators.required
      ],

      pay_type: [
        'PAYNEER',
        Validators.required
      ]

    });

  }

  get f() {
    return this.paymentForm.controls;
  }

  payNow() {

    if (this.paymentForm.invalid) {

      this.paymentForm.markAllAsTouched();

      return;

    }

    const formValue = this.paymentForm.value;

    console.log("Form Value -> ", formValue);

    const pay_type = formValue.pay_type;

    if (pay_type === 'PAYNEER') {

      window.open(
        'https://dashboard.skydo.com/login',
        '_blank'
      );

    }

    else if (pay_type === 'STRIPE') {

      window.open(
        'https://dashboard.stripe.com/login',
        '_blank'
      );

    }

    else if (pay_type === 'PAYPAL') {

      window.open(
        'https://www.paypal.com/in/signin',
        '_blank'
      );

    }

  }

  openCheckout(order: any) {

    const options = {

      key: 'rzp_test_SmsoI15mv72S6n',

      amount: order.amount,

      currency: order.currency,

      name: 'Wallet Recharge',

      description: 'Add Money To Wallet',

      image:
        'https://cdn-icons-png.flaticon.com/512/2489/2489756.png',

      order_id: order.id,

      prefill: {

        name: this.user.name,

        email: this.user.email,

        contact: this.user.mobile

      },

      notes: {

        user_id: this.user._id

      },

      theme: {

        color: '#0d6efd'

      },

      handler: (response: any) => {

        this.verifyPayment(response);

      },

      modal: {

        ondismiss: () => {

          this.loading = false;

          console.log('Payment popup closed');

        }

      }

    };

    const razorpay = new Razorpay(options);

    razorpay.open();

  }

  verifyPayment(response: any) {

    const payload = {

      razorpay_order_id:
        response.razorpay_order_id,

      razorpay_payment_id:
        response.razorpay_payment_id,

      razorpay_signature:
        response.razorpay_signature

    };

    this.paymentService.verifyPayment(payload)
      .subscribe({

        next: (res: any) => {

          this.loading = false;

          console.log(
            'Payment verified successfully',
            res
          );

          this.paymentForm.reset({

            currency: 'USD',

            pay_type: 'PAYNEER'

          });

          window.location.reload();

        },

        error: (err) => {

          this.loading = false;

          console.log(
            "Payment error -> ",
            err
          );
        }

      });

  }

}