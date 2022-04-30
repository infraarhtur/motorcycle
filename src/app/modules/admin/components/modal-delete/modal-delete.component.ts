import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from 'src/app/services/business/admin.service';
import { MotorcyclesService } from 'src/app/services/business/motorcycles.service';

@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.scss']
})
export class ModalDeleteComponent implements OnInit {
  form: FormGroup;
  titulo = 'Eliminar Moto';
  selectedItem: any;
  constructor(public AdminService: AdminService,
    public dialogRef: MatDialogRef<ModalDeleteComponent>,
    private motorcycleService: MotorcyclesService,
    @Inject(MAT_DIALOG_DATA) public dataSource: any) {
     
      this.selectedItem = this.dataSource;
  }

  ngOnInit(): void {
  }

  delete(){
    this.motorcycleService.deleteMotorcycle(this.selectedItem.id);
  }

}
