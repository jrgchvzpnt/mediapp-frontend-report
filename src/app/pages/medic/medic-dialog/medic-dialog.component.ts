import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { Medic } from '../../../Model/medic';
import { FormsModule, NgModel } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MedicService } from '../../../services/medic.service';
import { switchMap } from 'rxjs';
import { NgIf } from '@angular/common';




@Component({
  selector: 'app-medic-dialog',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './medic-dialog.component.html',
  styleUrl: './medic-dialog.component.css',
})
export class MedicDialogComponent implements OnInit {
  medic: Medic;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Medic,
    private _dialogRef: MatDialogRef<MedicDialogComponent>,
    private medicService: MedicService
  ) {}

  ngOnInit(): void {
    this.medic = { ...this.data }; // spread operator
  }

  close() {
    this._dialogRef.close();
  }

  operate() {
    if (this.medic != null && this.medic.idMedic > 0) {
      //UPDATE
      this.medicService
        .update(this.medic.idMedic, this.medic)
        .pipe(switchMap(() => this.medicService.findAll()))
        .subscribe((data) => {
          this.medicService.setMedicChange(data);
          this.medicService.setMessageChange('UPDATE!');
        });
    }else{
       this.medicService
         .save(this.medic)
         .pipe(switchMap(() => this.medicService.findAll()))
         .subscribe((data) => {
           this.medicService.setMedicChange(data);
           this.medicService.setMessageChange('CREATED!');
         });
    }
    this.close();
  }
}
