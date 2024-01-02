import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient
  ) { }

  getUser(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${environment.API_URL}/users/${id}`);
  }

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${environment.API_URL}/users`);
  }

  addUser(data: IUser): Observable<IUser> {
    return this.http.post<IUser>(`${environment.API_URL}/users`, data);
  }

  editUser(id: string, data: IUser): Observable<IUser> {
    return this.http.put<IUser>(`${environment.API_URL}/users/${id}`, data);
  }

  deleteUsers(id: string): Observable<IUser> {
    return this.http.delete<IUser>(`${environment.API_URL}/users/${id}`);
  }
}
