import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './components/list/list.component';
import { CatalogueRoutingModule } from './catalogue-routing.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailComponent } from './components/detail/detail.component';
import { NgxPaginationModule } from 'ngx-pagination';

import { NgImageSliderModule } from 'ng-image-slider';



@NgModule({
  declarations: [
    ListComponent,
    DetailComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    CatalogueRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgImageSliderModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CatalogueModule { }
