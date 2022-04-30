import { Injectable } from '@angular/core';
import { Login } from 'src/app/models/shared/login.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public urlBase = '';
  constructor(private _http: HttpClient) {
    this.urlBase = environment.urlBaseServicio;
  }

  logIn(credenciales: Login) {
    
    const url = `${this.urlBase}/login?user=${credenciales.user}&password=${credenciales.password}`;
    return this._http.get<Login>(url);
  }

  isLoggedIn(): boolean {
    let sesion = localStorage.getItem('IsIdentity');

    if (sesion == 'true') {
      return true;
    }

    return false;
  }



  enviarToken() {
    //  const url = `${this.urlBase}/seguridad/token`;
    //  const token = localStorage.getItem('token').toString();
    //  const httpOptions = new HttpHeaders().append('X-TOKEN', token);
    // { headers: httpOptions }
    const url = `http://a2d7f89d-rutgas-rutgasingr-adf1-212373188.us-east-1.elb.amazonaws.com/gateway/v1/seguridad/token`;
    return this._http.get(url);
  }
}
