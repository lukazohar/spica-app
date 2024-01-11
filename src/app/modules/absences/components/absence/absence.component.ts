import { Component, Inject } from '@angular/core';
import { IAbsence } from '../../../../models/absence';
import { IAbsenceDefinition } from '../../../../models/absence-definition';
import { AbsencesService } from '../../../../services/absences.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IAbsenceCreate } from 'src/app/models/absence-create';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-absence',
  templateUrl: './absence.component.html',
  styleUrls: ['./absence.component.scss']
})
export class AbsenceComponent {
  absence: IAbsenceCreate = {
    Timestamp: new Date(),
    AbsenceDefinitionId: '',
    Origin: 0,
    IsPartial: false,
    OverrideHolidayAbsence: false,
  };
  absenceDefinitions: IAbsenceDefinition[] = [];

  constructor(
    private absencesService: AbsencesService,
    public dialogRef: MatDialogRef<AbsenceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IAbsenceCreate,
    private _snackBar: MatSnackBar
  ) {
    if (data) this.absence = {...this.absence, ...data };
    this.getAbsenceDefinitons();
  }

  addAbsence() {
    console.log("🚀 ~ AbsenceComponent ~ this.absencesService.addAbsence ~ this.absence:", this.absence)
    this.absencesService.addAbsence(this.absence).subscribe({
      next: (res) => {
        this._snackBar.open("Absence successfully created!", "OK", { duration: 5000 });
        this.dialogRef.close(res);
      },
      error: (err) => {
        this._snackBar.open("Absence creation failed!", "OK", { duration: 5000 });
        console.log(err)
      } 
    });
  }

  getAbsenceDefinitons() {
    this.absencesService.getAbsenceDefinitions().subscribe({
      next: (res) => {
        this.absenceDefinitions = res
      },
      error: (err) => console.log(err)
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
