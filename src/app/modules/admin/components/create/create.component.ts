import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/business/admin.service';
import { environment } from 'src/environments/environment';
import { GenericLists } from 'src/app/models/business/generic.model';
import { Motorcycle } from 'src/app/models/business/motorcycle.model';
import { MotorcyclesService } from 'src/app/services/business/motorcycles.service';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

import *  as XLSX from 'xlsx';

import { Brands, BreakTypes, IgnitionTypes, References, SuspensionTypes } from '../../../../enums/enums'


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  providers: [
    MotorcyclesService
  ]
})
export class CreateComponent implements OnInit {
  files: File[] = [];
  links = [];  
  public brands = Brands;
  public references = References;
  public ignitionTypes = IgnitionTypes;
  public breakTypes = BreakTypes;
  public SuspensionTypes = SuspensionTypes;
  motorcycleLst: Array<Motorcycle> = [];
  motorcycleLstFireBase: Array<Motorcycle> = [];

  error: Array<string> = [];
  success: Array<string> = [];

  constructor(public service: AdminService,
    private motorcycleService: MotorcyclesService,
    private _snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
  }
  

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
          const objRes = JSON.parse(res);
          this.links.push(`${count} ${objRes.secure_url}`) ;
       
          if (count === countFiles) {
            this.files = [];
          }
        });
      });
    }
  }

  getMotorcyclesFromFirebase(){
    this.motorcycleService.getAllMotorcycles().subscribe((res: any) => {
      res.forEach(doc => {
        const moto = new Motorcycle();
        moto.id = doc.id;
        moto.brand = doc.data().brand;
        moto.reference = doc.data().reference;
        moto.year = doc.data().year;
        moto.milliage = doc.data().milliage;
        moto.sellValue = doc.data().sellValue;
        moto.principalImage = doc.data().principalImage;
        moto.backBrake = doc.data().backBrake;
        moto.frontBrake = doc.data().frontBrake;
        moto.frontSuspension = doc.data().frontSuspension;
        moto.ignitionType = doc.data().ignitionType;
        moto.rearSuspension = doc.data().rearSuspension;
        moto.state = doc.data().state;
        moto.registrationNumber = doc.data().registrationNumber;
        this.motorcycleLstFireBase.push(moto);
      });

      this.validateMotorcycles(this.motorcycleLstFireBase);

    });
  }

  validateMotorcycles(motorcycles: Array<Motorcycle>){
    let deleteflag = false;

    let  firebaseMotorcycles = motorcycles.map(item => {
      return item.registrationNumber;
    });
    this.motorcycleLst.forEach(item => {
      
      if(firebaseMotorcycles.includes(item.registrationNumber)){
        this.error.push(item.registrationNumber);
      }
      else{
        this.success.push(item.registrationNumber);
      }      
    });

    this.error.forEach(item => {
      let index = this.motorcycleLst.findIndex(d => d.registrationNumber === item); //find index in your array
      this.motorcycleLst.splice(index, 1);//remove element from array
    });

    

    if(this.motorcycleLst.length > 0){
      this.saveMotorcycles(this.motorcycleLst);
      this.router.navigate(['/Admin/list']);
      debugger;
      if(this.error.length > 0){
        this.openSnackBarError(`No se cargaron ${this.error.length} motos: ${this.error}`, 'Cerrar');
      }
      
    }
    else{
      this.openSnackBarError(`No se cargaron ${this.error.length} motos, todas estan repetidas en la base de datos: ${this.error}`,'Cerrar');
    }
  }

  openSnackBarSuccess(message: string, action:string){
    this._snackBar.open(message, action,{
      panelClass: ["snack-bar-success"],
      horizontalPosition: "start",
      verticalPosition: "top",
    });
  }

  openSnackBarError(message: string, action:string){
    this._snackBar.open(message, action,{
      panelClass: ["snack-bar-error"]
    });
  }

  saveMotorcycles(motorcycleLst: Array<Motorcycle>){
    
    motorcycleLst.forEach(item => {
        this.motorcycleService.addMotorcycle(item).then(res => {
        });
    }); 
  }

  uploadData(event: any){    

    let filesData = event.target.files[0];  
    let fileReader = new FileReader(); 
    fileReader.readAsArrayBuffer(filesData);     
      fileReader.onload = (e) => {    
          let arrayBuffer: any = fileReader.result;    
          var data = new Uint8Array(arrayBuffer);    
          var arr = new Array();    
          for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);    
          var bstr = arr.join("");    
          var workbook = XLSX.read(bstr, {type:"binary"});    
          var first_sheet_name = workbook.SheetNames[0];    
          var worksheet = workbook.Sheets[first_sheet_name];    
          let filelist = [];  
          filelist = XLSX.utils.sheet_to_json(worksheet,{raw:true});     

          for (let i = 1; i < filelist.length; i++) {
            let moto = new Motorcycle();    
            let excelRow = filelist[i];

            try {
              debugger
              // get brand
              const brand = new GenericLists();
              brand.id = Number(this.brands[excelRow.__EMPTY_1]);
              brand.name = this.brands[brand.id];

              //get reference
              const reference = new GenericLists();
              reference.id = Number(this.references[excelRow.__EMPTY_2]);
              reference.name = this.references[reference.id].replace('_',' ');

              //get ignition type
              const ignitionType = new GenericLists();
              ignitionType.id = Number(this.ignitionTypes[excelRow.__EMPTY_9]);
              ignitionType.name = this.ignitionTypes[ignitionType.id].replace('_',' ');

              // get front brake  type
              const frontBrake = new GenericLists();
              frontBrake.id = Number(this.breakTypes[excelRow.__EMPTY_10]);
              frontBrake.name = this.breakTypes[frontBrake.id].replace('_',' ');

              //get back break type
              const backBreak = new GenericLists();
              backBreak.id = Number(this.breakTypes[excelRow.__EMPTY_11]);
              backBreak.name = this.breakTypes[backBreak.id].replace('_',' ');

              //get front suspension type
              const frontSuspension = new GenericLists();
              frontSuspension.id = Number(this.SuspensionTypes[excelRow.__EMPTY_12]);
              frontSuspension.name = this.SuspensionTypes[frontSuspension.id].replace('_',' ');

              //get rear supension type
              const rearSuspension = new GenericLists();
              rearSuspension.id = Number(this.SuspensionTypes[excelRow.__EMPTY_13]);
              rearSuspension.name = this.SuspensionTypes[rearSuspension.id].replace('_',' ');

              moto.brand = brand;
              moto.reference = reference;
              moto.year = excelRow.__EMPTY_3;
              moto.cc = excelRow.__EMPTY_4;
              moto.power = excelRow.__EMPTY_5;
              moto.torque = excelRow.__EMPTY_6;
              moto.weigth = excelRow.__EMPTY_7;
              moto.fuelCapacity = excelRow.__EMPTY_8;
              moto.ignitionType = ignitionType;
              moto.frontBrake = frontBrake;
              moto.backBrake = backBreak;
              moto.frontSuspension = frontSuspension;
              moto.rearSuspension = rearSuspension;
              moto.frontTire = excelRow.__EMPTY_14;
              moto.rearTire = excelRow.__EMPTY_15;
              moto.accessories = excelRow.__EMPTY_16;
              moto.dateSoat = excelRow.__EMPTY_17;
              moto.dateTecno = excelRow.__EMPTY_18;
              moto.registrationNumber = excelRow.__EMPTY_19;
              moto.milliage = excelRow.__EMPTY_20;
              moto.description = excelRow.__EMPTY_21;
              moto.sellValue = excelRow.__EMPTY_22;
              moto.minimumSaleValue = excelRow.__EMPTY_23;
              moto.commissionValue = excelRow.__EMPTY_24;
              moto.ownersName = excelRow.__EMPTY_25;
              moto.ownerEmail = excelRow.__EMPTY_26;
              moto.ownerPhoneNumber = excelRow.__EMPTY_27;   
              
              this.motorcycleLst.push(moto); 
            } catch (error) {
                this.openSnackBarError(`Ocurrio un error con el excel`,'Cerrar');
                throw error
            }        
          }

          this.getMotorcyclesFromFirebase();
    }
  }  

}
