import { Component, Inject } from '@angular/core';
import { IUser } from '../../../../models/user';
import { UsersService } from '../../../../services/users.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  user: IUser = {};

  constructor(
    private usersService: UsersService,
    public dialogRef: MatDialogRef<UserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IUser,
    private _snackBar: MatSnackBar
  ) {
    if (data) this.user = data
  }

  addUser(user: IUser) {
    this.user = {...this.user, ...user};
    this.usersService.addUser(this.user).subscribe({
      next: (res) => {
        this._snackBar.open("User successfully created!", "OK", { duration: 5000 });
        this.dialogRef.close(res);
      },
      error: (err) => {
        this._snackBar.open("User creation failed!", "OK", { duration: 5000 });
        console.log(err)
      } 
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
