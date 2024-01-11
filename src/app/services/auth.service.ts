import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment.development';
import { Token } from '../models/token';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient,
    private jwtHelper: JwtHelperService
  ) { }

  isTokenValid(): boolean {
    const tokenString = localStorage.getItem("ACCESS_TOKEN");
    if (!tokenString) return false;

    const token = <Token>JSON.parse(tokenString);
    return !this.isTokenExpired(token);
  }

  private isTokenExpired(token: Token): boolean {
    return this.jwtHelper.isTokenExpired(token.access_token);
  }

  refreshToken(): Observable<Token> {
    const body = new URLSearchParams();
    body.set("grant_type", "client_credentials");
    body.set("client_id", environment.CLIENT_ID);
    body.set("client_secret", environment.CLIENT_SECRET);
    body.set("scope", "api");

    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
    });

    return this.httpClient.post<Token>(environment.TOKEN_ENDPOINT, body, { headers }).pipe(
      tap(token => this.setToken(token))
    );
  }

  setToken(token: Token) {
    localStorage.setItem("ACCESS_TOKEN", JSON.stringify(token))
  }
  getToken(): Token {
    const tokenString = localStorage.getItem("ACCESS_TOKEN");
    return <Token>JSON.parse(tokenString as string);
  }
}
