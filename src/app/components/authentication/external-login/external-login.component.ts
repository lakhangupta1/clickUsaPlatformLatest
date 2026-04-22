import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-external-login',
  standalone: true,
  template: `<p>Logging you in...</p>`
})
export class ExternalLoginComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      try {
        const token = params.get('token');
        const refreshToken = params.get('refreshtoken');
        // console.log(" token in external.ts -> ", token);
        // console.log(" refreshToken in external.ts -> ", refreshToken );
        // if (!token || !refreshToken) {
        //   this.failLogin();
        //   return;
        // }

        if (token && refreshToken) {
          // this.authService.externalLogin({
          //   token,
          //   refreshtoken: refreshToken
          // })
          // console.log("Token -- ",token)
          // console.log("step-1");
          this.toastr.success("Login Successful");
          this.router.navigate(['/dashboard']);
        } else {
          // console.log("step-1");
          this.toastr.error(" Unauthenticated user!1", "Error!");
          this.router.navigate(['/login']);
        }
      } catch (error) {
        // console.log(" error in external service -> ", error.message);
        this.toastr.error(" Unauthenticated user!2", "Error!");
        this.router.navigate(['/']);
      }
    });
    this.router.navigate(['/']);
  }

  private failLogin() {
    this.toastr.error('Unauthenticated user!', 'Error!');
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
