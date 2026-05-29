import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-empty',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './empty.component.html',
  styleUrl: './empty.component.scss'
})
export class EmptyComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {

    // CHECK LOGIN

    // const token = localStorage.getItem('token');
    // console.log(" token -> ", token );
    // if (token) {
    //   // REDIRECT TO DASHBOARD
    //   this.router.navigate(['/dashboard']);
    // }
    this.authService.logout();
    this.router.navigate(['/']);
    // localStorage.clear();

  }

  testimonials = [
    {
      name: 'Michael Johnson',
      company: 'MediaBoost',
      message:
        'Amazing tracking platform with real-time analytics and excellent support.'
    },
    {
      name: 'Sophia Williams',
      company: 'AdScale Network',
      message:
        'The dashboard and offer management system helped us scale campaigns faster.'
    },
    {
      name: 'David Miller',
      company: 'ClickWave',
      message:
        'Easy integration, accurate statistics and powerful postback features.'
    }
  ];

  features = [
    {
      title: 'Real-Time Analytics',
      description:
        'Track clicks, conversions and campaign performance instantly.'
    },
    {
      title: 'Offer Management',
      description:
        'Manage affiliate offers and campaigns from a single dashboard.'
    },
    {
      title: 'Postback Tracking',
      description:
        'Advanced postback and conversion tracking support.'
    },
    {
      title: 'Smart Reporting',
      description:
        'Detailed reports with daily, weekly and monthly insights.'
    },
    {
      title: 'Secure Platform',
      description:
        'Highly secure infrastructure with fast performance.'
    },
    {
      title: 'API Integration',
      description:
        'Easy API integrations for advertisers and publishers.'
    }
  ];

}