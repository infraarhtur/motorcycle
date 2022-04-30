import { Component, OnInit, ViewChild } from '@angular/core';
import { productI } from 'src/app/models/business/product.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { productListColumns } from 'src/app/shared/enum/product-list-column.enum';
import { AdminService } from 'src/app/services/business/admin.service';
import { ModalDeleteComponent } from '../modal-delete/modal-delete.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  ModalDeleteComponent: ModalDeleteComponent
  ELEMENT_DATA: productI[] = [];
  displayedColumns: string[] = [
    productListColumns.actions,
    productListColumns.id,
    productListColumns.model,
    productListColumns.mark,
    productListColumns.year,
    productListColumns.ownerName,
    productListColumns.ownerEmail,
    productListColumns.ownerPhone,
    productListColumns.state,
    productListColumns.registrationNumber

  ];
  dataSource = new MatTableDataSource<productI>(this.ELEMENT_DATA);
  product: productI;
  serviceData: AdminService | null;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    public dialog: MatDialog,
    public adminService: AdminService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private _snackBar: MatSnackBar
    
  ) {
    this.matIconRegistry.addSvgIcon(
      'files',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/svg/undraw_personal_file_222m.svg'),
    );

  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getProducstList();
  }

  applyFilter(e) {
    const filterValue = e.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  getProducstList(){
    let productList = [];
    
    this.adminService.getProductsFire().subscribe((res: any) => {
      res.forEach(doc => {
        let product = {
          id: doc.id,
          mark: doc.data().brand.name,
          model: doc.data().reference.name,
          year: doc.data().year,
          milliage: doc.data().milliage,
          sellPrice: doc.data().sellValue,
          description: doc.data().description,
          ownerName: doc.data().ownersName,
          ownerPhone: doc.data().ownerPhoneNumber,
          ownerEmail: doc.data().ownerEmail,
          accessories: doc.data().accessories,
          state:doc.data().state.name,
          registrationNumber: doc.data().registrationNumber
        } as productI;
        productList.push(product);
      });
      this.dataSource.data = productList as productI[];
    });
  }

  refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }


  openModalDelete(row) {
    const dialogComponent = new MatDialogConfig();
    dialogComponent.autoFocus = true;
    dialogComponent.disableClose = true;
    dialogComponent.data = row;
    const dialogRef = this.dialog.open(ModalDeleteComponent, dialogComponent);
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.getProducstList();
        this._snackBar.open('Eliminacion correcta', 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000,
        }); 
      }
    });

  }

  openCreate(){
   this.router.navigate(['/Admin/create']);
   }

}
