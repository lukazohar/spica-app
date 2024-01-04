import { Component, Inject } from '@angular/core';
import { IUser } from '../../../../models/user';
import { UsersService } from '../../../../services/users.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
  ) {
    if (data) this.user = data
  }

  addUser(user: IUser) {
    this.user = {...this.user, ...user};
    this.usersService.addUser(this.user).subscribe({
      next: (res) => {
        this.dialogRef.close(res);
      },
      error: (err) => console.log(err)
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
