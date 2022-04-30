import {
  Component,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  AfterViewInit,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { NavService } from 'src/app/services/shared/nav.service';
import { NavItem } from '../../../models/shared/navItem.model';
import { MenuDinamicoService } from '../../../services/shared/menu-dinamico.service';
import { Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthFireService } from '../../../services/shared/auth-fire.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import { OnInit } from '@angular/core';
import {  MatDialog, MatDialogConfig } from '@angular/material/dialog';
 import { ModalLogInComponent } from '../modal-log-in/modal-log-in.component';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
   @ViewChild('drawer')
  appDrawer!: ElementRef;
  @Output() cierreSesion = new EventEmitter();
  navItems: NavItem[] = [];
  nombre:string;
  email:string;
  photo:string;
  userSubs : Subscription;
  apellido: string;
  public identity;
  isIdentity = false;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  showSubmenu: boolean = false;
  showSubmenuEjemplos: boolean = false;
  panelOpenState = false;
  modalLogIn:ModalLogInComponent;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private navService: NavService,
    private _menuServices: MenuDinamicoService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public router:Router,
    public authFireService:AuthFireService,
    public store:Store<AppState>,
    private userService: AuthFireService,
    public dialog: MatDialog,
    
  ) {

    this.matIconRegistry.addSvgIcon(
      'user',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/svg/user.svg'),
    );


    this.navItems = [
      {
        "displayName": "Ejemplos",
        "iconName": "self_improvement",
        "route": "",
        "children": [

          {
            "displayName": "basico",
            "iconName": "airline_seat_flat",
            "route": "/Ejemplos/basico"
          },

          {
            "displayName": "table",
            "iconName": "airline_seat_flat",
            "route": "/Ejemplos/table"
          }
        ]
      }
      ,
      {
        "displayName": "Principal 2",
        "iconName": "airline_seat_flat",
        "children": [
          {
            "displayName": "home",
            "iconName": "view_comfy",
            "route": "/home",
            "children": []
          }

        ]
      }

      ,
      {
        "displayName": "Debtors",
        "iconName": "people_alt",
        "children": [
          {
            "displayName": " Create",
            "iconName": "person_add",
            "route": "/debtor/create",
            "children": []
          },
          {
            "displayName": "List",
            "iconName": "list",
            "route": "/debtor/list",
            "children": []
          }


        ]
      }
    ]
  }

  ngOnInit(){

setTimeout(() => {
  this.identity = this.userService.getIdentity();
  let logated = localStorage.getItem('IsIdentity');
  if(this.identity !== null ||  Boolean(logated)){
    this.isIdentity = true;
  }
  else{
    this.isIdentity = false;
  }
  console.log('identity', this.identity );
}, 2000);

    

    const username = localStorage.getItem('DisplayName');
    const photo = localStorage.getItem('PhotoURL');
    if(username != null){
      this.nombre = username;
      this.photo = photo;
    }
    else{
      this.userSubs=  this.store.select('user').subscribe(({user})=> {
        this.nombre =  user?.name ;
        this.apellido = user?.lastName
        this.email = user?.email;
       })
    }
  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }

  logUp(){
   this.authFireService.logout().then(resp => {

    localStorage.setItem('IsIdentity', 'false');

    this.cierreSesion.emit(false);
    localStorage.clear();
    window.localStorage.clear();

    this.router.navigate(['/Catalogue']);
    window.location.reload();
   });
  }
  logIn(){

    const dialogComponent = new MatDialogConfig();
    dialogComponent.autoFocus = true;
    dialogComponent.disableClose = true;
    dialogComponent.data = '';
    const dialogRef = this.dialog.open(ModalLogInComponent, dialogComponent);
    dialogRef.disableClose = true;
  }

  ngOnDestroy(){
    if(this.userSubs){
      this.userSubs.unsubscribe();
    }

  }

}
