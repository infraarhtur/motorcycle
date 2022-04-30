import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { productI } from 'src/app/models/business/product.model';
import { AngularFirestore } from '@angular/fire/firestore';



@Injectable({
  providedIn: 'root'
})
export class AdminService {
  public urlBase = '';
  constructor(private httpClient: HttpClient, private fireStore: AngularFirestore,) {
    this.urlBase = environment.urlBaseServicio;
  }

  /**
   * call data service of products
   * @returns list of products
   */
  getProducts(): Observable<productI[]> {
    const url = `${this.urlBase}/products`;
    return this.httpClient.get<productI[]>(url);
  }

  /**
   * get info motorcycle of fire base
   * @returns 
   */
  getProductsFire() {
    const motorcyclesRef = this.fireStore.collection('motorcycles');
    return motorcyclesRef.get();

  }



  uploadImage(formData) {
    const url = `https://api.cloudinary.com/v1_1/${environment.nameCloudinary}/image/upload`;
    return fetch(url, {
      method: "POST",
      body: formData
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {

        return data
      });
  }
  /**
   * call data service of products
   * @returns list of products
   */
  getPhotos(): Observable<any[]> {
    const url = `${this.urlBase}/photos`;
    return this.httpClient.get<any[]>(url);
  }

  deleteImage(formData) {
    const url = `https://api.cloudinary.com/v1_1/${environment.nameCloudinary}/image/destroy`;
    return fetch(url, {
      method: "POST",
      body: formData
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {

        return data
      });
  }
}

