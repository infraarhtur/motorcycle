import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFireService } from './services/shared/auth-fire.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public general: boolean;
  public login = true;
  title = 'las-dos-ruedas';

  constructor(
    private router: Router,
    public authFireService: AuthFireService
  ) {
    this.general = false;

    this.authFireService.initAuthListener();
    this.eventoSesion();
  }


  eventoSesion() {

    let identity = localStorage.getItem('IsIdentity');
    if (identity == 'false') {
      this.login = true;
      this.general = false;
    } else if (identity == 'true') {
      this.general = true;
      this.login = false;


      let urlStr = window.location.href.toString();
      let posicionCaracter = urlStr.indexOf("#");
      let pagina = urlStr.slice(posicionCaracter + 1, urlStr.length)

      if (pagina !== '/login') {
        this.router.navigate([pagina.toString()]);
      } else {
        this.router.navigate(['/home']);
      }

    }

    // "usuario" es el que estas recibiendo desde el hijo,
    // asignalo a una propiedad que este asociada al input con ngModel o ve que haces con el
  }

}

