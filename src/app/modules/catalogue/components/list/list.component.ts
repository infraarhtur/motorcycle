import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Brand } from 'src/app/models/business/brand.model';
import { Motorcycle } from 'src/app/models/business/motorcycle.model';
import { MotorcyclesService } from 'src/app/services/business/motorcycles.service';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Reference } from 'src/app/models/business/reference.model';


import { brandsEnum } from 'src/app/enums/brands.enum';
import { breakTypesEnum } from "src/app/enums/BreakTypes.enum";
import { suspensionTypesEnum } from "src/app/enums/suspensionTypes.enum";
import { ignitionTypesEnum } from "src/app/enums/ignitionTypes.enum";
import { referencesEnum } from "src/app/enums/references.enum";
import { debounce } from 'lodash';
import { debounceTime } from 'rxjs/operators';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CryptoJsService } from 'src/app/services/shared/crypto-js.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogErrorComponent } from 'src/app/shared/components/dialog-error/dialog-error.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [
    MotorcyclesService
  ]
})
export class ListComponent implements OnInit {
  motorcycleLst: Array<Motorcycle> = [];
  brandLst: Array<Brand> = [];
  referenceLst: Array<Reference> = [];
  motorcycle = new Motorcycle();
  filtersForm: FormGroup;
  totalLength: any;
  directionLinks: boolean = true;
  actualPage = 1
  pageSizes = [10, 30, 50, 100];
  pageSize = 10;
  minimalPriceField = 0;
  maximumPriceField = 0;
  motorcycleLstInit: Array<Motorcycle> = [];
  //#region "enums general lists"
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

  priceMin: number = 0;
  priceMax: number = 0;

  maxMilleage = 0;
  minMilleage = 0;

  minMilleageField = 0;
  maxMilleageField = 0;
  //#endregion "My Region"

  referenceField = 0;
  brandField = 0;


  items = Array.from({ length: 100000 }).map((_, i) => `Item #${i}`);

  constructor(private formBuilder: FormBuilder,
    private motorcycleService: MotorcyclesService,
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private criptoService: CryptoJsService,
    private dialogSpiner: MatDialog
  ) {
    this.matIconRegistry.addSvgIcon(
      'remove-filter',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/svg/filter-remove.svg'),
    );
    this.loadKeysEnums();
  }

  ngOnInit(): void {
    let dialogref = this.dialogSpiner.open(DialogErrorComponent,{
      panelClass: 'custom-modalbox'
    });
       // cerrar spiner
       setTimeout(() => {
        this.closeDialogo(dialogref);
      }, 2000);

    this.actualPage = 1;
    this.filtersValidation();
    //this.getMotorcycles();
    this.showMotorcycles();
  }

  /**
   * Method for get motorcycles
   * @returns list of motorcycles
   */
  getMotorcycles() {
 
    this.motorcycleService.getMotorcycles().subscribe((res: any) => {

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
        moto.images = doc.data().images;
        moto.frontTire = doc.data().frontTire;
        moto.rearTire = doc.data().rearTire;
        moto.registrationNumber = doc.data().registrationNumber;
        moto.cc = doc.data().cc;
        moto.power = doc.data().power;
        moto.torque = doc.data().torque;
        moto.dateSoat = doc.data().dateSoat;
        moto.dateTecno = doc.data().dateTecno;
        moto.description = doc.data().description;
        moto.accessories = doc.data().accessories;
        this.motorcycleLst.push(moto);
      });
      this.totalLength = this.motorcycleLst.length;

      //add localstograge
      const dataEncript = this.criptoService.encryptUsingAES256(JSON.stringify(this.motorcycleLst));
      localStorage.setItem('motorcycleLst', dataEncript);

      const dateQueryEncript = this.criptoService.encryptUsingAES256(this.getDateString());
      localStorage.setItem('dateQuery', dateQueryEncript);

      //values max and min
      this.getValuesMaxAndMin();

   
    });
  }

  /** this method add logic for localstorage */
  showMotorcycles() {

    const validation = this.validationStorage()
    if (validation) {

      setTimeout(() => {
        const encriptData = localStorage.getItem('motorcycleLst');
        let data = this.criptoService.decryptUsingAES256(encriptData);

        this.motorcycleLst = JSON.parse(data);
        this.motorcycleLstInit = JSON.parse(data);
        this.totalLength = this.motorcycleLst.length;
        //values max and min
        this.getValuesMaxAndMin();

      }, 1000);

    } else {

      this.getMotorcycles();
    }
  }

  /** validate conditions localstorage */
  validationStorage() {
    const encriptData = localStorage.getItem('motorcycleLst');
    let dataStorage = this.criptoService.decryptUsingAES256(encriptData);

    const dateQueryEncript = localStorage.getItem('dateQuery');
    let dateQuery = this.criptoService.decryptUsingAES256(dateQueryEncript);
    let currentDate = this.getDateString();

    if ((dateQuery && dataStorage) &&
      (dateQuery === currentDate)
    ) {
      return true;

    } else {
      return false;
    }

  }
  /** get current date format string  */
  getDateString() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    return mm + '/' + dd + '/' + yyyy;
  }

  /** get data values max and min of price , milleage */
  getValuesMaxAndMin() {
    let prices = this.motorcycleLst.map(element => {
      return Number(element.sellValue);
    })

    let millage = this.motorcycleLst.map(element => {
      return Number(element.milliage);
    })

    this.priceMin = Math.min(...prices);
    this.priceMax = Math.max(...prices);

    this.minMilleage = Math.min(...millage);
    this.maxMilleage = Math.max(...millage);

    this.minimalPriceField = this.priceMin;
    this.maximumPriceField = this.priceMax;

    this.maxMilleageField = this.maxMilleage;
    this.minMilleageField = this.minMilleage;
  }


  getMotorcyclesMock() {
    this.actualPage = 1;
    this.motorcycleService.getMotorcyclesMock().subscribe((res: any) => {

      this.motorcycleLst = res;
      this.motorcycleLstInit = res;
      this.totalLength = this.motorcycleLst.length;

      let prices = res.map(element => {
        return Number(element.sellValue);
      })

      let millage = res.map(element => {
        return Number(element.milliage);
      })
      this.priceMin = Math.min(...prices);
      this.priceMax = Math.max(...prices);

      this.minMilleage = Math.min(...millage);
      this.maxMilleage = Math.max(...millage);

      this.minimalPriceField = this.priceMin;
      this.maximumPriceField = this.priceMax;

      this.maxMilleageField = this.maxMilleage;
      this.minMilleageField = this.minMilleage;
    });
  }

  /**
   * Method for get brands
   * @returns list of brands
   */
  getBrands() {
    this.motorcycleService.getBrands().subscribe((res: any) => {
      res.forEach(doc => {
        const brand = new Brand();
        brand.id = doc.id;
        brand.name = doc.data().name;
        this.brandLst.push(brand);
      });
    });
  }



  /**
   * Method for redirecto to detail motorcycle component
   */


  /**
  * Method for change page size
  */
  handlePageSizeChange(event) {

    this.actualPage = 1;
    this.pageSize = event.target.value;
  }


  /**
   * load keys of enums or generics lists 
   */
  loadKeysEnums() {
    this.brandKeys = Object.keys(brandsEnum).filter(f => !isNaN(Number(f)));
    this.breakTypesKeys = Object.keys(breakTypesEnum).filter(f => !isNaN(Number(f)));
    this.suspensionTypesKeys = Object.keys(suspensionTypesEnum).filter(f => !isNaN(Number(f)));
    this.ignitionTypesKeys = Object.keys(ignitionTypesEnum).filter(f => !isNaN(Number(f)));
    this.referencesKeys = Object.keys(referencesEnum).filter(f => !isNaN(Number(f)));
  }

  searchFilter(event) {
    event.preventDefault();
    if (this.filtersForm.valid) {
      this.multiFilter();
    }

  }

  resetFilter(event) {
    event.preventDefault();
    this.minimalPriceField = this.priceMin;
    this.maximumPriceField = this.priceMax;
    this.minMilleageField = this.minMilleage;
    this.maxMilleageField = this.maxMilleage;
    this.filtersForm.value['reference'] = 0;
    this.referenceField = 0;
    this.filtersForm.value['brand'] = 0;
    this.brandField = 0;

    this.motorcycleLst = [];
    this.motorcycleLst = this.motorcycleLst.concat(this.motorcycleLstInit);

  }


  filtersValidation() {
    this.filtersForm = this.formBuilder.group({
      brand: [0, [Validators.required]],
      reference: [0, [Validators.required]],
      minimalPrice: [0, [Validators.required]],
      maximumPrice: [0, [Validators.required]],
      minimumMileage: [0, [Validators.required]],
      maximumMileage: [0, [Validators.required]]

    });

    this.filtersForm.valueChanges.pipe(debounceTime(500)).subscribe(
      value => {
        this.multiFilter();
      }
    )
  }

  formatLabel(value: number) {
    if (value >= 1000000) {
      return Math.round(value / 1000000) + 'M';
    }
    return value;
  }
  formatLabelKM(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'K';
    }
    return value;
  }


  onChangeMinimalPrice(e) {
    this.minimalPriceField = e.value;
    this.filtersForm.value['minimalPrice'] = e.value;
    this.multiFilter();
  }
  onChangemaximumPrice(e) {
    this.maximumPriceField = e.value;
    this.filtersForm.value['maximumPrice'] = e.value;
    this.multiFilter();
  }

  onChangeMinMilleage(e) {
    this.minMilleageField = e.value;
    this.filtersForm.value['minimumMileage'] = e.value;
    this.multiFilter();
  }

  onChangeMaxMilleage(e) {
    this.maxMilleageField = e.value;
    this.filtersForm.value['maximumMileage'] = e.value;
    this.multiFilter();
  }

  multiFilter() {
    this.motorcycleLst = [];
    this.motorcycleLst = this.motorcycleLstInit;

    if (this.filtersForm.value['brand'] !== 0) {
      this.motorcycleLst = this.motorcycleLst.filter(item => {
        return item.brand.id == this.filtersForm.value['brand'];
      })
    }

    if (this.filtersForm.value['reference'] !== 0) {
      this.motorcycleLst = this.motorcycleLst.filter(item => {
        return item.reference.id == this.filtersForm.value['reference'];
      })
    }

    if (this.filtersForm.value['minimumMileage'] !== 0) {
      let millageMin: number = this.filtersForm.value['minimumMileage'];
      this.motorcycleLst = this.motorcycleLst.filter(item => {

        return item.milliage >= millageMin;
      })
    }

    if (this.filtersForm.value['maximumMileage'] !== 0) {
      let millageMax: number = this.filtersForm.value['maximumMileage'];
      this.motorcycleLst = this.motorcycleLst.filter(item => {

        return item.milliage <= millageMax;
      })
    }

    if (this.filtersForm.value['minimalPrice'] !== 0) {
      let minimalPrice = Number(this.filtersForm.value['minimalPrice']);
      this.motorcycleLst = this.motorcycleLst.filter(item => {
        return Number(item.sellValue) >= minimalPrice;
      })
    }

    if (this.filtersForm.value['maximumPrice'] !== 0) {
      let maximumPrice = Number(this.filtersForm.value['maximumPrice']);
      this.motorcycleLst = this.motorcycleLst.filter(item => {
        return Number(item.sellValue) <= maximumPrice;
      })
    }
  }

  closeDialogo(dialogoRef: MatDialogRef<DialogErrorComponent, any>) {
    dialogoRef.close()
  }
}
