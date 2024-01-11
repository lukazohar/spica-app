import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UsersDataSource } from './users-datasource';
import { UsersService } from '../../../../services/users.service';
import { IUser } from '../../../../models/user';
import { map, tap } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserComponent } from '../user/user.component';
import { AbsencesService } from 'src/app/services/absences.service';
import { AbsenceComponent } from 'src/app/modules/absences/components/absence/absence.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<IUser>;
  dataSource: UsersDataSource = new UsersDataSource();

  displayedColumns = ['FirstName', 'LastName', 'Email', 'Id'];
  isLoading = false;

  constructor(
    private usersService: UsersService,
    public userDialog: MatDialog,
    public absenceDialog: MatDialog,
    private absencesService: AbsencesService
  ) {}

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.filter();
  }

  filterFirstName: string = "";
  filterLastName: string = "";

  filter() {
    this.isLoading = true;
    this.dataSource = new UsersDataSource();
    this.usersService.getUsers().pipe(
      map(res => res.filter(x => x.FirstName?.includes(this.filterFirstName) && x.LastName?.includes(this.filterLastName))),
      tap(users => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.loadUsers(users);
        this.table.dataSource = this.dataSource;
      })
    ).subscribe({
      complete: () => this.isLoading = false,
      error: (err) => this.isLoading = false
    });
  }

  addUser(): void {
    const dialogRef = this.userDialog.open(UserComponent);
    dialogRef.afterClosed().subscribe();
  }

  addAbsence(userId: string): void {
    const dialogRef = this.absenceDialog.open(AbsenceComponent, { data: { userId }});
    dialogRef.afterClosed().subscribe();
  }
}
