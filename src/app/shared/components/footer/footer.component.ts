import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  whatsappPhoneNumber: string;

  constructor() {
    this.whatsappPhoneNumber = environment.whatsapp;
   }

  ngOnInit(): void {
  }

  goToLinkedin(){
    window.open('https://www.linkedin.com/company/lasdosruedas/?viewAsMember=true', '_blank').focus();
  }

  goToInstagram(){
    window.open('https://www.instagram.com/LasdosRuedasCo/', '_blank').focus();
  }

  goToWhatsapp(){
    window.open(`https://api.whatsapp.com/send?phone=${this.whatsappPhoneNumber}&text=Hola%21%20Quisiera%20conocer%20mas%20acerca%20de%20LasDosRuedas`, '_blank').focus();
  }

  goToFacebook(){
    window.open('https://www.facebook.com/Las-Dos-Ruedas-108000134936133', '_blank').focus();
  }

}
