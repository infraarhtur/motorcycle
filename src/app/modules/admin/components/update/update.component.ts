import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { brandsEnum } from 'src/app/enums/brands.enum';
import { breakTypesEnum } from 'src/app/enums/BreakTypes.enum';
import { ignitionTypesEnum } from 'src/app/enums/ignitionTypes.enum';
import { referencesEnum } from 'src/app/enums/references.enum';
import { suspensionTypesEnum } from 'src/app/enums/suspensionTypes.enum';
import { selectInicial } from 'src/app/functions/select.validators';
import { Motorcycle } from 'src/app/models/business/motorcycle.model';
import { AdminService } from 'src/app/services/business/admin.service';
import { MotorcyclesService } from 'src/app/services/business/motorcycles.service';
import { environment } from 'src/environments/environment';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogErrorComponent } from 'src/app/shared/components/dialog-error/dialog-error.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { statesEnum } from 'src/app/enums/states.enum';


@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  updateMotorcycleForm: FormGroup;
  files: File[] = [];
  links = [];
  brandKeys = [];
  brandsEnum = brandsEnum;
  breakTypesKeys = [];
  breakTypesEnum = breakTypesEnum;
  suspensionTypesKeys = [];
  suspensionTypesEnum = suspensionTypesEnum;
  ignitionTypesKeys = [];
  ignitionTypesEnum = ignitionTypesEnum;
  referencesKeys = [];
  referencesEnum = referencesEnum;
  statesEnum = statesEnum;
  statesKeys = []
  motorcycle: Motorcycle;
  listDeleteImages = [];
  listAddImages = [];
  urlNewImages = [];
  loading;
  paramId;


  @ViewChild('brandSelect') brandSelect: MatSelect;
  @ViewChild('referenceSelect') referenceSelect: MatSelect;
  @ViewChild('ignitionTypeSelect') ignitionTypeSelect: MatSelect;
  @ViewChild('frontBrakeSelect') frontBrakeSelect: MatSelect;
  @ViewChild('backBrakeSelect') backBrakeSelect: MatSelect;
  @ViewChild('frontSuspensionSelect') frontSuspensionSelect: MatSelect;
  @ViewChild('rearSuspensionSelect') rearSuspensionSelect: MatSelect;
  @ViewChild('statusSelect') statusSelect: MatSelect;

  constructor(public service: AdminService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private motorcycleService: MotorcyclesService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private dialogSpiner: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router) {

      this.matIconRegistry.addSvgIcon(
        'remove-filter',
        this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/svg/filter-remove.svg'),
      );
      this.loading= this.dialogSpiner.open(DialogErrorComponent,{
        panelClass: 'custom-modalbox'
      });
    this.loadKeysEnums();
    this.basicValidations();
  }

  ngOnInit(): void {
   
    this.route.params.subscribe((param: Params) => {
      this.paramId = param.id;
      this.motorcycleService.getMotorcycleById(param.id).subscribe((res: any) => {
        this.motorcycle = res.data();
        this.createFile(this.motorcycle.principalImage);
        this.motorcycle.images.map((item) => {
          this.createFile(item.image);
          this.closeDialogo(this.loading);
        })
        this.setValuesToUpdate();

      });
    });
  }

  onSubmit() {
  this.loading= this.dialogSpiner.open(DialogErrorComponent,{
    panelClass: 'custom-modalbox'
  });
    this.onUpLoad();
    setTimeout(() => {
      this.reorderImages();
      
      this.motorcycle.year = this.updateMotorcycleForm.value.txtYear;
      this.motorcycle.accesories = this.updateMotorcycleForm.value.txtAccesories;
      this.motorcycle.state.id= this.statusSelect.value;
      this.motorcycle.state.name = this.statesEnum[this.statusSelect.value.toString()];
      this.motorcycleService.updateMotorcycle(this.paramId, this.motorcycle).then((res: any) => {
        this.listDeleteImages =[];
        this.links =[];
        this.closeDialogo(this.loading);
        this._snackBar.open('Edición correcta', 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000,
        }); 
        this.router.navigate(['/Admin/list']);
      });
    }, 2000);
  }

  reorderImages() {
    //quitar imagenes si estan entre la lista
    this.listDeleteImages.map(item => this.motorcycle.images.splice(this.motorcycle.images.indexOf(item), 1));
    
    //agregar imagenes en caso de haber nuevas
    this.links.map(item => {
      let orders = this.motorcycle.images.map(item => item.order);
      let maxValue = Math.max(...orders)
      let oImage = {
        thumbImage: item,
        alt: 'alt',
        image: item,
        order: maxValue + 1,
        title: 'title'
      }

      this.motorcycle.images.push(oImage)
    })


  }
  onSelect(event) {
    this.listAddImages.push(...event.addedFiles);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    const item = this.motorcycle.images.find(item => item.image.includes(event.name));
    item ? this.listDeleteImages.push(item) : this.listAddImages.splice(this.listAddImages.indexOf(event), 1);
    this.files.splice(this.files.indexOf(event), 1);
  }

  onUpLoad() {
    if (!this.listAddImages[0]) {
      // alert('no hay imagenes nuevas');
    } else {
      //upload image
      let count = 0;
      let countFiles = this.listAddImages.length;
      this.listAddImages.forEach(items => {

        const file = items;
        const data = new FormData();
        data.append('cloud_name', environment.nameCloudinary);
        data.append('file', file);
        data.append('upload_preset', environment.presetCloudinary);

        this.service.uploadImage(data).then(res => {
          count += 1;
          const objRes = JSON.parse(res);
          this.links.push(`${objRes.secure_url}`);
          if (count === countFiles) {
            this.listAddImages = [];
          }
        });
      });
    }
  }

  onDeleteImage() {
    const timestamp = Math.round((new Date).getTime() / 1000).toString();
    const data = new FormData();
    data.append('cloud_name', environment.nameCloudinary);
    data.append('public_id', 'dmpwjfvchx39kpxue8t9');
    data.append('upload_preset', environment.presetCloudinary);
    data.append('signature', 'zGgzf-gRbjowqyi-Tr5IC43Uyb4');
    data.append('api_key', '517158161637531');
    data.append('timestamp', timestamp);
    data.append('resource_type', 'image');
    this.service.deleteImage(data).then(res => {
     
    })
  }

  setValuesToUpdate() {
    this.updateMotorcycleForm.get('txtYear').setValue(this.motorcycle.year);
    this.updateMotorcycleForm.get('txtMilliage').setValue(this.motorcycle.milliage);
    this.updateMotorcycleForm.get('txtWeigth').setValue(this.motorcycle.weigth);
    this.updateMotorcycleForm.get('txtRegistrationNumber').setValue(this.motorcycle.registrationNumber);
    this.updateMotorcycleForm.get('txtCc').setValue(this.motorcycle.cc);
    this.updateMotorcycleForm.get('txtPower').setValue(this.motorcycle.power);
    this.updateMotorcycleForm.get('txtTorque').setValue(this.motorcycle.torque);
    this.updateMotorcycleForm.get('txtFuelCapacity').setValue(this.motorcycle.fuelCapacity);
    this.updateMotorcycleForm.get('txtFrontTire').setValue(this.motorcycle.frontTire);
    this.updateMotorcycleForm.get('txtRearTire').setValue(this.motorcycle.rearTire);
    this.updateMotorcycleForm.get('txtDateSOAT').setValue(this.motorcycle.dateSoat);
    this.updateMotorcycleForm.get('txtDateTecno').setValue(this.motorcycle.dateTecno);
    this.updateMotorcycleForm.get('txtOwnersName').setValue(this.motorcycle.ownersName);
    this.updateMotorcycleForm.get('txtOwnerEmail').setValue(this.motorcycle.ownerEmail);
    this.updateMotorcycleForm.get('txtOwnerPhoneNumber').setValue(this.motorcycle.ownerPhoneNumber);
    this.updateMotorcycleForm.get('txtMinimumSaleValue').setValue(this.motorcycle.minimumSaleValue);
    this.updateMotorcycleForm.get('txtSellValue').setValue(this.motorcycle.sellValue);
    this.updateMotorcycleForm.get('txtCommissionValue').setValue(this.motorcycle.commissionValue);
    this.updateMotorcycleForm.get('txtDescription').setValue(this.motorcycle.description);
    this.updateMotorcycleForm.get('txtAccesories').setValue(this.motorcycle.accesories);
    this.brandSelect.value = this.motorcycle.brand.id.toString();
    this.referenceSelect.value = this.motorcycle.reference.id.toString();
    this.ignitionTypeSelect.value = this.motorcycle.ignitionType.id.toString();
    this.frontBrakeSelect.value = this.motorcycle.frontBrake.id.toString();
    this.backBrakeSelect.value = this.motorcycle.backBrake.id.toString();
    this.frontSuspensionSelect.value = this.motorcycle.frontSuspension.id.toString();
    this.rearSuspensionSelect.value = this.motorcycle.rearSuspension.id.toString();
    this.statusSelect.value = this.motorcycle.state.id.toString();

  }

  loadKeysEnums() {
    this.brandKeys = Object.keys(brandsEnum).filter(f => !isNaN(Number(f)));
    this.breakTypesKeys = Object.keys(breakTypesEnum).filter(f => !isNaN(Number(f)));
    this.suspensionTypesKeys = Object.keys(suspensionTypesEnum).filter(f => !isNaN(Number(f)));
    this.ignitionTypesKeys = Object.keys(ignitionTypesEnum).filter(f => !isNaN(Number(f)));
    this.referencesKeys = Object.keys(referencesEnum).filter(f => !isNaN(Number(f)));
    this.statesKeys = Object.keys(statesEnum).filter(f => !isNaN(Number(f)));
  }

  basicValidations() {
    this.updateMotorcycleForm = this.formBuilder.group({
      ddlBrand: [0, [Validators.required]],
      ddlReference: [0, [Validators.required, selectInicial]],
      ddlIgnitionType: [0, [Validators.required, selectInicial]],
      ddlFrontBrake: [0, [Validators.required, selectInicial]],
      ddlBackBrake: [0, [Validators.required, selectInicial]],
      ddlFrontSuspension: [0, [Validators.required, selectInicial]],
      ddlRearSuspension: [0, [Validators.required, selectInicial]],
      ddlStatus: [0, [Validators.required, selectInicial]],
      txtYear: ['', [Validators.required]],
      txtMilliage: ['', [Validators.required]],
      txtWeigth: ['', [Validators.required]],
      txtRegistrationNumber: ['', [Validators.required]],
      txtCc: ['', [Validators.required]],
      txtPower: ['', [Validators.required]],
      txtTorque: ['', [Validators.required]],
      txtFuelCapacity: ['', [Validators.required]],
      txtFrontTire: ['', [Validators.required]],
      txtRearTire: ['', [Validators.required]],
      txtDateSOAT: ['', [Validators.required]],
      txtDateTecno: ['', [Validators.required]],
      txtOwnersName: ['', [Validators.required]],
      txtOwnerEmail: ['', [Validators.required]],
      txtOwnerPhoneNumber: ['', [Validators.required]],
      txtMinimumSaleValue: ['', [Validators.required]],
      txtSellValue: ['', [Validators.required]],
      txtCommissionValue: ['', [Validators.required]],
      txtDescription: [''],
      txtAccesories: [''],
      Validators: []
    });
  }

  get txtYear() {
    return this.updateMotorcycleForm.get('txtYear');
  }


  async createFile(imageUrl: string) {
    let response = await fetch(imageUrl);
    let data = await response.blob();
    let metadata = {
      type: 'image/jpeg',
      urlInitial: imageUrl
    };
    let file = new File([data], this.cutNameUrl(imageUrl), metadata);
    this.files.push(file);

  }

  cutNameUrl(urlImage: string) {
    const posInit = urlImage.indexOf('motorcycles/');
    const countTotal = urlImage.length;
    return urlImage.slice(posInit + 12, countTotal);
  }

  closeDialogo(dialogoRef: MatDialogRef<DialogErrorComponent, any>) {
    dialogoRef.close()
  }

}
