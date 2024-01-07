import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, finalize, switchMap, take, throwError } from 'rxjs';
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
                this.refreshTokenSubject.next(token);
                this.authService.setToken(token);
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
