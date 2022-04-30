import { EventEmitter, Injectable, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { UserModel } from '../../models/shared/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as authActions from '../../shared/components/auth.actions';
import { Subscription } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

import firebase from 'firebase/app';
import { CryptoJsService } from './crypto-js.service';


@Injectable({
  providedIn: 'root'
})
export class AuthFireService {
  @Output() eventoSesion = new EventEmitter();
  public rol;

  userSubscription: Subscription;
  private _user: UserModel;
  get user(){
     return this._user;
   }
  constructor(
    public auth: AngularFireAuth,
    private fireStore: AngularFirestore,
    private store: Store<AppState>,
    private _snackBar: MatSnackBar,
    private criptoService: CryptoJsService
  ) { }




  initAuthListener() {
    try {
      this.auth.authState.subscribe(fUser => {
        if (fUser) {

          //existe
          this.userSubscription = this.fireStore.doc(`users/${fUser.uid}`).valueChanges()
            .subscribe((fireStoreUser: any) => {
              const user1 = UserModel.fromFirebase(fireStoreUser)
              this._user = user1;
              this.store.dispatch(authActions.setUser({ user: user1 }))
  
            })
          //  this.store.dispatch(authActions.setUser())
        } else {
  
          //no existe
          if (this.userSubscription) {
            this.userSubscription.unsubscribe();
          }
          // this._user = null;
          // this.store.dispatch(authActions.unSetUser());
        }
  
      })
      
    } catch (error) {
      console.log(error);
      
    }
    
  }

  crearUsuario(nombre: string, apellido: string, email: string, pwd: string) {

    return this.auth.createUserWithEmailAndPassword(email, pwd)
      .then(({ user }) => {
        const newUser = new UserModel(user!.uid, nombre, apellido, email);

        const configuration = {
          url : 'http://localhost:4200/#/Catalogue'
        }

        user.sendEmailVerification(configuration).catch(error=>{
          console.error(error);
        });

        this._snackBar.open('Revisa tu email y confirma tu correo electronico','Cerrar');

        this.auth.signOut();

        return this.fireStore.collection('users').doc(user!.uid)
          .set({
            uid: user!.uid,
            name: nombre,
            lastName: apellido,
            email: email,
            rol:  {
              id: 2,
              name: 'Client'
            }
          });

      });
  }

  authGoogleAccount(){
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.auth.signInWithPopup(provider);
  }

  loginUsuario(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password).then(result => {
      if(result.user.emailVerified){
        return result;
      }
      else{
        this.auth.signOut();
        return result;
      }
    });
  }

  logout() {
    return this.auth.signOut();
  }


  isAuth() {
    return this.auth.authState.pipe(
      map(fbUser => fbUser != null) //devuelve un true o un false 
    )
  }

  passwordResetByEmail(email: string) {
    return this.auth.sendPasswordResetEmail(email);
  }

  getUserInfo(uid:string){
    
    const userRef = this.fireStore.collection('users', ref => ref.where('uid', '==', uid));
    return  userRef.get();
  }

  getIdentity(){
    
    let rolEncrypt = localStorage.getItem('Rol');

    if (rolEncrypt !== null ){
      let rol = this.criptoService.decryptUsingAES256(rolEncrypt.toString());
   
    
    
    if(rol != undefined)    {
      this.rol = rol;
    }
    else{
      this.rol = null;
    }
  }else{
    this.rol = null;
  }

    return this.rol;
  }

}
