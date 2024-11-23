import { Component } from '@angular/core';
import { IngresosService } from '../../services/ingresos.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrl: './ingresos.component.css'
})
export class IngresosComponent {
  ingresosList: any = [];
  ingresosForm: any = this.formBuilder.group({
    nombre: '',
    descripcion: '',
    monto: '',
    fecha: Date
  })
  editableIngresos: boolean = false;
  idIngresos: any;

  constructor(private ingresosService: IngresosService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getAllIngresos();
  }

  getAllIngresos() {
    this.ingresosService.getAllIngresosData().subscribe((data: {}) => {
      this.ingresosList = data;
    });
  }

  newMessages(messageText: string) {
    this.toastr.success('Clic aquí para actualizar la lista', messageText)
      .onTap
      .pipe(take(1))
      .subscribe(() => window.location.reload());
  }
  newIngresoEntry() {
    this.ingresosService.newIngreso(localStorage.getItem('accessToken'), this.ingresosForm.value).subscribe(
      () => {
                this.router.navigate(['/ingresos']).then(() => {
          this.newMessages('Registro exitoso');
        })
      }
    );
  }


  deleteIngresoEntry(id: any) {
    console.log(`Eliminando Ingreso con ID: ${id}`); // Se agrega un comentario indicando que se va a eliminar el ingreso
    this.ingresosService.deleteIngreso(id).subscribe(() => {
      console.log(`Ingreso con ID: ${id} eliminado exitosamente.`); // Confirmación de eliminación exitosa
    });
  }
  
}
