import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
//#region Componentes
import { HomeComponent } from './shared/components/home/home.component';

// import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/shared/auth.service';
import { LoginComponent } from './shared/components/login/login.component';
import { BrowserModule } from '@angular/platform-browser';
import { AuthFireGuard } from './guards/auth-fire.guard';
import { AdminGuard } from './guards/admin.guard';

//#endregion Componentes

const routes: Routes = [


  {
    path: '',
    redirectTo: '/Catalogue',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'login/:token',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthFireGuard],
  },

  {
    path: 'Catalogue',
    loadChildren: () => import('./modules/catalogue/catalogue.module').then(m => m.CatalogueModule)
  },
  {
    path: 'Admin',
    canActivate: [
      AdminGuard
    ],
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
  }
  
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes, {useHash: true, preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule],
  providers: [AuthService]
 
})
export class AppRoutingModule { }
