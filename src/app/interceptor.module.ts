import { Injectable, NgModule} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS} from '@angular/common/http';

export class AddHttpHeaderInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth header from the service.
    const authHeader = '*';
    const clonedReq = req.clone({headers: req.headers.set('Access-Control-Allow-Origin', authHeader)});

    return next.handle(clonedReq);
  }
}



@NgModule({
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AddHttpHeaderInterceptor,
    multi: true,
  }],
})

export class InterceptorModule {}
