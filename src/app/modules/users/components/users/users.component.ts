import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Observable, of, tap } from 'rxjs';
import { IUser } from '../../interfaces/user';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {
  $users: Observable<IUser[]> = of();
  displayedColumns: string[] = ['FirstName', 'LastName', 'Email'];
  
  dataSource = new MatTableDataSource<IUser>();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;


  constructor(
    private usersService: UsersService,
    private _liveAnnouncer: LiveAnnouncer
  ) {
  }

  ngOnInit() {
    this.getUsers().pipe(
      tap(res => this.dataSource.data = res)
    ).subscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator as MatTableDataSourcePaginator;
    this.dataSource.sort = this.sort as MatSort;
    this.dataSource.filterPredicate = function (record, filter) {
      return `${record.FirstName.toLowerCase()}${record.LastName.toLowerCase()}`.indexOf(filter) != -1;
   }
  }

  getUsers(): Observable<IUser[]> {
    return this.usersService.getUsers();
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
