import { Injectable } from '@angular/core';
import { Observable, forkJoin, mergeMap } from 'rxjs';
import { IAbsence } from '../interfaces/absence';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AbsencesService {

  constructor(
    private http: HttpClient
  ) { }

  getAbsence(id: string): Observable<IAbsence> {
    return this.http.get<IAbsence>(`${environment.API_URL}/absences/${id}`);
  }

  getAbsences(): Observable<IAbsence[]> {
    return this.http.get<IAbsence[]>(`${environment.API_URL}/absences`);
  }

  getAbsencesByDate(dateFrom: Date, dateTo: Date): Observable<IAbsence[]> {
    const params = {
      params: new HttpParams().set('dateFrom ', dateFrom.toString()).set('dateTo ', dateTo.toString())
    };
    /* return this.http.get<IAbsence[]>(`${environment.API_URL}/absences/Obfuscated`, params); */ // This would be used, if backend would return 'comment' on query '/Obfuscated', and the query would be very quicker, since it doesn't have to fetch all Absences
    return this.http.get<IAbsence[]>(`${environment.API_URL}/absences/Obfuscated`, params).pipe(
      mergeMap(absences => forkJoin(absences.map(x => this.getAbsence(x.Id))))
    );
  }
}
