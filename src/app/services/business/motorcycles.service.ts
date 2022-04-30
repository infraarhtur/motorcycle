import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Motorcycle } from 'src/app/models/business/motorcycle.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MotorcyclesService {
  urlBase;
  constructor(
    private fireStore: AngularFirestore,private _http: HttpClient
  ) {

    this.urlBase = environment.urlBaseServicio;
  }

  getMotorcyclesMock() {
  
    const url = `${this.urlBase}/motos`;

    return this._http.get(url);
  }


  /**
   * call data service of motorcycles collection
   * @returns list of motorcycles
   */
  getMotorcycles() {
    const motorcyclesRef = this.fireStore.collection('motorcycles', ref => ref.where('state.name', '==', 'Publicado'));
    return motorcyclesRef.get();
  }

  getMotorcycleById(id: string){
    const motorcycle = this.fireStore.collection('motorcycles').doc(id);
    return motorcycle.get();
  }

  updateMotorcycle(id: string, motorcycle: Motorcycle){
    return this.fireStore.collection('motorcycles').doc(id).set({
      brand: {
        id: motorcycle.brand.id,
        name: motorcycle.brand.name
      },
      reference: {
        id: motorcycle.reference.id,
        name: motorcycle.reference.name
      },
      year: motorcycle.year,
      cc: motorcycle.cc,
      power: motorcycle.power,
      torque: motorcycle.torque,
      weigth: motorcycle.weigth,
      fuelCapacity: motorcycle.fuelCapacity,
      ignitionType: {
        id: motorcycle.ignitionType.id,
        name: motorcycle.ignitionType.name
      },
      frontBrake: {
        id: motorcycle.frontBrake.id,
        name: motorcycle.frontBrake.name
      },
      backBrake: {
        id: motorcycle.backBrake.id,
        name: motorcycle.backBrake.name
      },
      frontSuspension: {
        id: motorcycle.frontSuspension.id,
        name: motorcycle.frontSuspension.name
      },
      rearSuspension: {
        id: motorcycle.rearSuspension.id,
        name: motorcycle.rearSuspension.name
      },
      frontTire: motorcycle.frontTire,
      rearTire: motorcycle.rearTire,
      accesories: motorcycle.accesories,
      dateSoat: motorcycle.dateSoat,
      dateTecno: motorcycle.dateTecno,
      registrationNumber: motorcycle.registrationNumber,
      milliage: motorcycle.milliage,
      description: motorcycle.description,
      sellValue: motorcycle.sellValue,
      minimumSaleValue: motorcycle.minimumSaleValue,
      commissionValue: motorcycle.commissionValue,
      ownersName: motorcycle.ownersName,
      ownerEmail: motorcycle.ownerEmail,
      ownerPhoneNumber: motorcycle.ownerPhoneNumber,
      state: {
        id: motorcycle.state.id,
        name: motorcycle.state.name
      },
      images:motorcycle.images,
      principalImage:motorcycle.principalImage
    });

  }

  getAllMotorcycles() {
    const motorcyclesRef = this.fireStore.collection('motorcycles');
    return motorcyclesRef.get();
  }

  /**
   * call data service of brands collection
   * @returns list of brands
   */
  getBrands() {
    const brandRef = this.fireStore.collection('brands');
    return brandRef.get();
  }

  /**
   * call data service of references collection
   * @returns list of references
   */
  getReference() {
    const referenceRef = this.fireStore.collection('references');
    return referenceRef.get();
  }

  addMotorcycle(motorcycle: Motorcycle) {
    var moto = this.fireStore.collection('motorcycles').add({
      brand: {
        id: motorcycle.brand.id,
        name: motorcycle.brand.name
      },
      reference: {
        id: motorcycle.reference.id,
        name: motorcycle.reference.name
      },
      year: motorcycle.year,
      cc: motorcycle.cc,
      power: motorcycle.power,
      torque: motorcycle.torque,
      weigth: motorcycle.weigth,
      fuelCapacity: motorcycle.fuelCapacity,
      ignitionType: {
        id: motorcycle.ignitionType.id,
        name: motorcycle.ignitionType.name
      },
      frontBrake: {
        id: motorcycle.frontBrake.id,
        name: motorcycle.frontBrake.name
      },
      backBrake: {
        id: motorcycle.backBrake.id,
        name: motorcycle.backBrake.name
      },
      frontSuspension: {
        id: motorcycle.frontSuspension.id,
        name: motorcycle.frontSuspension.name
      },
      rearSuspension: {
        id: motorcycle.rearSuspension.id,
        name: motorcycle.rearSuspension.name
      },
      frontTire: motorcycle.frontTire,
      rearTire: motorcycle.rearTire,
      accessories: motorcycle.accessories,
      dateSoat: motorcycle.dateSoat,
      dateTecno: motorcycle.dateTecno,
      registrationNumber: motorcycle.registrationNumber,
      milliage: motorcycle.milliage,
      description: motorcycle.description,
      sellValue: motorcycle.sellValue,
      minimumSaleValue: motorcycle.minimumSaleValue,
      commissionValue: motorcycle.commissionValue,
      ownersName: motorcycle.ownersName,
      ownerEmail: motorcycle.ownerEmail,
      ownerPhoneNumber: motorcycle.ownerPhoneNumber,
      state: {
        id: 1,
        name: 'Creado'
      },
      principalImage: "https://res.cloudinary.com/lasdosruedas/image/upload/v1647271276/LDRProfile_vrkewl.png",
      images: [
        {
          alt: "",
          image: "",
          order: 1,
          thumbImage: "",
          title: ""
        }
      ]
    });

    return moto;
  }

  deleteMotorcycle(id: any){
    const res = this.fireStore.collection('motorcycles').doc(id).delete();
  }
  
}
