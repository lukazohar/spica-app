import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AbsencesDataSource } from './absences-datasource';
import { AbsencesService } from '../../../../services/absences.service';
import { tap } from 'rxjs';
import { IAbsence } from 'src/app/models/absence';

@Component({
  selector: 'app-absences',
  templateUrl: './absences.component.html',
  styleUrls: ['./absences.component.scss']
})
export class AbsencesComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<IAbsence>;
  dataSource: AbsencesDataSource = new AbsencesDataSource();

  displayedColumns = ['FirstName', 'LastName', 'Comment'];
  isLoading = false;

  date = new Date();

  constructor(
    private absencesService: AbsencesService
  ) {}

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.refreshAbsences(this.date);
  }

  refreshAbsences(date: Date) {
    this.isLoading = true;
    this.absencesService.getAbsencesByDate(date, new Date(new Date(date).setDate(date.getDate() + 1))).pipe(
      tap(absences => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.loadAbsences(absences);
        this.table.dataSource = this.dataSource;
      })
    ).subscribe({
      complete: () => this.isLoading = false,
      error: (err) => this.isLoading = false
    });
  }
}
