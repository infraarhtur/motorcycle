import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthFireService } from '../services/shared/auth-fire.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router,
    private userService: AuthFireService,
    private _snackBar: MatSnackBar,
  ){}
  
  canActivate(){
    let identity = this.userService.getIdentity();
    
  
    if(identity && identity === 'Administrator'){
        return true;
    }
    else{
        this.router.navigate(['/Home']);
        this.openSnackBarError(`No puedes acceder a esta ruta, lo sentimos`,'Cerrar');
        return false;
    }
  
  }

  openSnackBarError(message: string, action:string){
    this._snackBar.open(message, action,{
      panelClass: ["snack-bar-error"]
    });
  }
  
}
