import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UsersDataSource } from './users-datasource';
import { UsersService } from '../../services/users.service';
import { IUser } from '../../interfaces/user';
import { tap } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserComponent } from '../user/user.component';

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

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['FirstName', 'LastName', 'Email'];
  isLoading = false;

  constructor(
    private usersService: UsersService,
    public userDialog: MatDialog  ) {}

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
  addUser(): void {
    const dialogRef = this.userDialog.open(UserComponent);
    dialogRef.afterClosed().subscribe();
  }
}
