import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { NgImageSliderComponent } from 'ng-image-slider';
import { Motorcycle } from 'src/app/models/business/motorcycle.model';
import { Image } from 'src/app/models/business/image.model';
import { MotorcyclesService } from 'src/app/services/business/motorcycles.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CryptoJsService } from 'src/app/services/shared/crypto-js.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  providers: [
    MotorcyclesService
  ]
})
export class DetailComponent implements OnInit {

  @ViewChild('nav') slider: NgImageSliderComponent;
  panelOpenState = false;
  moto = new Motorcycle();
  imageObject: Array<Image> = [];
  pricipalImage: Image = new Image();
  whatsappMessage: string;
  whatsappPhoneNumber: string;
  copy: boolean;
  motorcycleLst: Array<Motorcycle> = [];

  constructor(private route: ActivatedRoute,
              private motorcycleService: MotorcyclesService,
              private _snackBar: MatSnackBar,
              private criptoService: CryptoJsService) { 
                this.whatsappPhoneNumber = environment.whatsapp;
              }

  ngOnInit(): void {

    const encriptData = localStorage.getItem('motorcycleLst');
    let data = this.criptoService.decryptUsingAES256(encriptData);
    this.motorcycleLst = JSON.parse(data);  

    this.route.params.subscribe((param : Params) => {
      const found = this.motorcycleLst.find(element => element.id === param.id);
      

      this.moto.id = found.id;
          this.moto.brand = found.brand;
          this.moto.reference = found.reference;          
          this.moto.year = found.year;
          this.moto.milliage = found.milliage;
          this.moto.weigth = found.weigth; 
          this.moto.registrationNumber = found.registrationNumber; 
          this.moto.cc = found.cc; 
          this.moto.power = found.power; 
          this.moto.torque = found.torque; 
          this.moto.frontBrake = found.frontBrake; 
          this.moto.backBrake = found.backBrake;
          this.moto.frontSuspension = found.frontSuspension;
          this.moto.rearSuspension = found.rearSuspension;
          this.moto.frontTire = found.frontTire;
          this.moto.rearTire = found.rearTire;
          this.moto.sellValue = found.sellValue;

          this.moto.dateSoat = found.dateSoat;
          this.moto.dateTecno = found.dateTecno;

          this.moto.description = found.description;
          this.moto.accessories = found.accessories;  

          this.pricipalImage.image = found.principalImage;
          this.pricipalImage.thumbImage = found.principalImage;
          this.pricipalImage.alt = 'Portada'
          this.pricipalImage.title = 'Portada'
          this.pricipalImage.order = 1
          this.imageObject.push(this.pricipalImage);
          this.moto.images = this.imageObject;

          found.images.forEach(img => {
            const image = new Image();
            image.image = img.image;
            image.thumbImage = img.thumbImage;
            image.title = img.title;
            image.alt = img.alt;
            image.order = img.order;
            this.imageObject.push(image);
          });

          this.whatsappMessage = `https://api.whatsapp.com/send?phone=${this.whatsappPhoneNumber}&text=Hola%21%20Quisiera%20m%C3%A1s%20informacion%20sobre%20este%20vehiculo,%20placa:%20${this.moto.registrationNumber}`
    });

  }

  whatsapp(){
    this.whatsappMessage = `https://api.whatsapp.com/send?phone=${this.whatsappPhoneNumber}&text=Hola%21%20Quisiera%20m%C3%A1s%20informacion%20sobre%20este%20vehiculo,%20placa:%20${this.moto.registrationNumber}`;
    window.open(this.whatsappMessage, "_blank");
  }

  share(){
    var url = window.location.href;
    this.openSnackBarInfo('has copiado el link.', 'Cerrar');

    let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = url;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.copy = true;
      setTimeout(()=>{
        this.copy = false;
      }, 2000)
     
  }

  openSnackBarInfo(message: string, action:string){
    this._snackBar.open(message, action,{
      panelClass: ["snack-bar-info"]
    });
  }

}
