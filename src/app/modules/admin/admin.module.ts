import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './components/list/list.component';
import { CreateComponent } from './components/create/create.component';
import { UpdateComponent } from './components/update/update.component';
import { AdminRoutingModule } from './admin-routing.module';

import { MaterialModule } from 'src/app/shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalDeleteComponent } from './components/modal-delete/modal-delete.component';
import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    UpdateComponent,
    ModalDeleteComponent,
   
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxDropzoneModule
  ]
})
export class AdminModule { }
