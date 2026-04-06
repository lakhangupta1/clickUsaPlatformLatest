import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { finalize, tap } from "rxjs/operators";
import { SpinnerService } from "src/app/services/spinner.service";

@Injectable({
  providedIn: "root",
})
export class SpinnerInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];
  constructor(private spinnerService:SpinnerService){}

  public isSpinnerVisible = new BehaviorSubject<boolean>(false);

  private removeRequest(req: HttpRequest<any>): void {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.spinnerService.isSpinnerVisible.next(this.requests.length > 0);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requests.push(req);
    this.spinnerService.isSpinnerVisible.next(true);

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.removeRequest(req);
        }
      }),
      finalize(() => {
        this.removeRequest(req);
      })
    );
  }
}
