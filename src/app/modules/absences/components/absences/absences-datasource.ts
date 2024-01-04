import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { IAbsence } from '../../interfaces/absence';

export class AbsencesDataSource extends DataSource<IAbsence> {
  data: IAbsence[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  
  constructor() {
    super();
  }

  connect(): Observable<IAbsence[]> {    
    if (this.paginator && this.sort) {
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  loadAbsences(data: IAbsence[], filter = '', sortDirection = 'asc', pageIndex = 0, pageSize = 3) {
    console.log(data);
    
    this.data = data;
}
  disconnect(): void {
  }

  private getPagedData(data: IAbsence[]): IAbsence[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  private getSortedData(data: IAbsence[]): IAbsence[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'FirstName': return compare(`${a.FirstName}`, `${b.FirstName}`, isAsc);
        case 'LastName': return compare(+`${a.LastName}`, +`${b.LastName}`, isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
