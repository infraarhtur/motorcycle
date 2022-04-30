import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CustomValidators } from '../../../functions/custom-validators';
import { AuthFireService } from 'src/app/services/shared/auth-fire.service';
import { UsersInterface } from 'src/app/models/shared/users.interface';

@Component({
  selector: 'app-reset-password-modal',
  templateUrl: './reset-password-modal.component.html',
  styleUrls: ['./reset-password-modal.component.scss']
})
export class ResetPasswordModalComponent implements OnInit {
  formResetPwd: FormGroup;
  description = 'Restablecer  contraseña';
  constructor(
    private _builders: FormBuilder,
    // private singletonService: DataCrubService,
    public dialogRef: MatDialogRef<ResetPasswordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public user: UsersInterface,
    // public dataService: DataCrubService
    public authFireService: AuthFireService
  ) { }

  ngOnInit(): void {
   this.RegistroFormGroup();
  }


  RegistroFormGroup() {
    this.formResetPwd = this._builders.group({
      email: ['', [Validators.email, Validators.required]],
    });
  }

  cerrar() {
    if( this.formResetPwd.valid){
      this.dialogRef.close(this.formResetPwd.value);
    }else{
      this.dialogRef.close(false);
    }    
    this.formResetPwd.reset();
  }

  agregarSubmit() {
    if (this.formResetPwd.invalid) {
      return Object.values(this.formResetPwd.controls).forEach(control => {
        control.markAllAsTouched();
      });
    }
  }


  passwordReset() {
    if (this.formResetPwd.invalid) { return; }
    const {email} = this.formResetPwd.value;
    this.cerrar();
  }

}
