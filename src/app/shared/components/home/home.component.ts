import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AdminService } from 'src/app/services/business/admin.service';
import { environment } from 'src/environments/environment';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  options: AnimationOptions = {
    path: '../../../../assets/lottie/motorcycle-loading.json',
  };

  constructor(public service: AdminService,
   private ngZone:NgZone,public dialog: MatDialog
  
   ) {
    // for (let index = 0; index < 10; index++) {

    //   let obj = {
    //     id: 1,
    //     name: `test ${index}`
    //   }
    //   this.objLis.push(obj);
    // }
  
      
  }

  ngOnInit(): void {
  }
  files: File[] = [];

  onSelect(event) {

    this.files.push(...event.addedFiles);
  }

  onRemove(event) {

    this.files.splice(this.files.indexOf(event), 1);
  }

  onUpLoad() {

    if (!this.files[0]) {
      alert('sube una imagen');
    } else {
      //upload image
      let count = 0;
      let countFiles = this.files.length;
      this.files.forEach(items => {

        const file = items;
        const data = new FormData();
        data.append('cloud_name', environment.nameCloudinary);
        data.append('file', file);
        data.append('upload_preset', environment.presetCloudinary);

        this.service.uploadImage(data).then(res => {
          count += 1;
          console.log('Respuesta', res);
          const objRes = JSON.parse(res);
          if (count === countFiles) {
            this.files = [];
          }
        });
      });
    }





    

  }

  animationCreated(animationItem: AnimationItem): void {
    animationItem.playSpeed = 0.5,
    animationItem;
  }
  openDialog() {
   let dialogref= this.dialog.open(DialogErrorComponent, {
    panelClass: 'custom-modalbox'
   });
   setTimeout(() => {
    this.closeDialogo(dialogref);
   }, 4000);
  }
  closeDialogo(dialogoRef: MatDialogRef<DialogErrorComponent, any>){
    dialogoRef.close()
  }
 
}
