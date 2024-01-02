import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Token } from '@angular/compiler';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("Test: ", request);
    return of(this.authService.isTokenValid()).pipe(
      switchMap(isTokenValid => {
        if (isTokenValid)
          return of(this.authService.getToken());
        return this.authService.refreshToken();
      }),
      switchMap(token => {
        request = request.clone({
          setHeaders: {
            Authorization: `${token.token_type} ${token.access_token}`,
          },
        });
        return next.handle(request);
      })
    )
  }
}
