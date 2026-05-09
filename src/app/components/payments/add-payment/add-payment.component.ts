// add-payment.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

// import { HttpClientModule } from '@angular/common/http';
import { PaymentService } from 'src/app/services/payment.service';

declare var Razorpay: any;

@Component({
  selector: 'app-add-payment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss']
})
export class AddPaymentComponent {

  paymentForm: FormGroup;

  loading: boolean = false;

  user: any = {
    _id: 'USER_ID',
    name: 'Lakhan Gupta',
    email: 'lakhan@gmail.com',
    mobile: '9999999999'
  };

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService
  ) {

    this.paymentForm = this.fb.group({
      amount: [ '', [ Validators.required, Validators.min(1) ] ],
      currency: ['INR']
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

    this.loading = true;
    const payload = {
      user_id: this.user._id,
      amount: this.paymentForm.value.amount,
      currency: this.paymentForm.value.currency
    };

    this.paymentService.createOrder(payload)
      .subscribe({
        next: (res: any) => {
          // backend may return different shapes; normalize
          const order = res?.order || res?.data || res;
          if (!order || !order.id) {
            this.loading = false;
            console.error('Invalid order response from server', res);
            // alert('Unable to create payment order. Please try again.');
            return;
          }
          this.openCheckout(order);
        },

        error: (err) => {
          this.loading = false;
          console.error(err);
          // alert('Unable to create payment order');
        }
      });

  }

  openCheckout(order: any) {
    // RAZORPAY_KEY_ID
    const options = {
      key: 'rzp_test_SmsoI15mv72S6n',
      amount: order.amount,
      currency: order.currency,
      name: 'Wallet Recharge',
      description: 'Add Money To Wallet',
      image: 'https://cdn-icons-png.flaticon.com/512/2489/2489756.png',
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
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature
    };

    this.paymentService.verifyPayment(payload)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          console.log('Payment verified successfully', res);
          // alert('Payment Successful');
          this.paymentForm.reset({
            currency: 'INR'
          });
          // refresh page after successful verification
          window.location.reload();
        },
        error: (err) => {
          this.loading = false;
          console.log("Payment error -> ", err);
          // alert('Payment Verification Failed');
        }
      });
  }
}