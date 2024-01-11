import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UsersDataSource } from './users-datasource';
import { UsersService } from '../../../../services/users.service';
import { IUser } from '../../../../models/user';
import { tap } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserComponent } from '../user/user.component';
import { AbsencesService } from 'src/app/services/absences.service';
import { AbsenceComponent } from 'src/app/modules/absences/components/absence/absence.component';

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
    this.isLoading = true;
    this.usersService.getUsers().pipe(
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

  filterFirstName: string = "";
  filterByFirstName() {
    console.log(this.filterFirstName);
    this.dataSource.loadUsers([]);
    this.dataSource.connect();
  }

  filterLastName: string = "";
  filterByLastName() {
    console.log(this.filterLastName);
    this.dataSource.loadUsers([]);
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
