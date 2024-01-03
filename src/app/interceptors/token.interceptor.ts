import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, finalize, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Token } from '../models/token';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<Token | null>(null);

  constructor(
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {    
    return next.handle(this.addAuthToken(request)).pipe(
      catchError((requestError: HttpErrorResponse) => {
        if (requestError && requestError.status === 401) {
          if (this.refreshTokenInProgress) {
            return this.refreshTokenSubject.pipe(
              filter((result) => result? true: false),
              take(1),
              switchMap(() => next.handle(this.addAuthToken(request)))
            );
          } else {
            this.refreshTokenInProgress = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshToken().pipe(
              switchMap((token) => {
                console.log("TEST 2");
                this.refreshTokenSubject.next(token);
                this.authService.setToken(token); // TODO: check this
                return next.handle(this.addAuthToken(request));
              }),
              finalize(() => (this.refreshTokenInProgress = false))
            );
          }
        } else {
          return throwError(() => new Error(requestError.message));
        }
      })
    );
    /* return of(this.authService.isTokenValid()).pipe(
      switchMap(isTokenValid => {
        if (isTokenValid)
          return of(this.authService.getToken());
        return this.authService.refreshToken();
      }),
      switchMap(token => {
        console.log(token);
        
        const modifiedRequest = request.clone({
          setHeaders: {
            Authorization: `${token.token_type} ${token.access_token}`,
          },
        });
        return next.handle(modifiedRequest);
      })
    ); */
  }

  addAuthToken(request: HttpRequest<any>) {
    const token = this.authService.getToken();
    
    if (!token)
      return request;

    return request.clone({
      setHeaders: {
        Authorization: `${token.token_type} ${token.access_token}`,
      },
    });
  }
}
