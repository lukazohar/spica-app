import { Injectable } from '@angular/core';
import { Observable, forkJoin, mergeMap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IAbsenceDefinition } from '../models/absence-definition';
import { IAbsence } from '../models/absence';
import { IAbsenceCreate } from '../models/absence-create';

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
    return this.http.get<IAbsence[]>(`${environment.API_URL}/absences/Obfuscated`, params).pipe(
      mergeMap(absences => forkJoin(absences.map(x => this.getAbsence(x.Id))))
    );
  }

  addAbsence(absence: IAbsenceCreate): Observable<IAbsence> {
    return this.http.post<IAbsence>(`${environment.API_URL}/Absences`, absence);
  }

  getAbsenceDefinitions(): Observable<IAbsenceDefinition[]> {
    return this.http.get<IAbsenceDefinition[]>(`${environment.API_URL}/AbsenceDefinitions`);
  }
}
