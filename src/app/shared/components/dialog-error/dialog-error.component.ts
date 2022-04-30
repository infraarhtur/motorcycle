import { Component, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { MatDialogRef } from '@angular/material/dialog';
import { MostrarOcultarSpinnerInterceptor } from 'src/app/interceptors/mostrar-ocultar-spinner.interceptor';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-error',
  templateUrl: './dialog-error.component.html',
  styleUrls: ['./dialog-error.component.scss']
})
export class DialogErrorComponent implements OnInit {
  


  
  constructor(
    public spinner : MatDialogRef<DialogErrorComponent>,
  ) { }

  ngOnInit(): void {
  }
  options: AnimationOptions = {
    path: '../../../../assets/lottie/motorcycle3.json',
  };
 
  animationCreated(animationItem: AnimationItem): void {
    animationItem.playSpeed = 0.5,
    
    animationItem
    
    
  }

 
}

