import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
//components material
import { MaterialModule } from './shared/material/material.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './shared/components/login/login.component';
import { MainComponent } from './shared/components/main/main.component';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import {appReducers} from './app.reducer';
import { RegisterComponent } from './shared/components/register/register.component';

//#region proveedores externos
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeComponent } from './shared/components/home/home.component';
import { DialogErrorComponent } from './shared/components/dialog-error/dialog-error.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
// import { ChartModule } from 'angular-highcharts';
import { HttpClientModule } from '@angular/common/http';

//fireBase
import { AngularFireModule } from '@angular/fire'
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
//components
import { ResetPasswordModalComponent } from './shared/components/reset-password-modal/reset-password-modal.component';
import { MenuListItemsComponent } from './shared/components/menu-list-items/menu-list-items.component';
import { Routes , RouterModule} from '@angular/router';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ModalLogInComponent } from './shared/components/modal-log-in/modal-log-in.component';


export function playerFactory() {
  return player;
}
const routes: Routes = [];

//#endregion proveedores externos
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    RegisterComponent,
    HomeComponent,
    DialogErrorComponent,
    ResetPasswordModalComponent,
    MenuListItemsComponent,
    FooterComponent,
    ModalLogInComponent    
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    /*components material */
    MaterialModule,
    FormsModule,
    HttpClientModule,
    /*Firebase */
     AngularFireModule.initializeApp(environment.firebase),
    // AngularFireAnalyticsModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
   /* ReactiveFormsModule,*/
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    AppRoutingModule,
    FontAwesomeModule,
    LottieModule.forRoot({ player: playerFactory }),
    NgxDropzoneModule,
  ],
  providers: [
    MaterialModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
