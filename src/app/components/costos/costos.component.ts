import { Component } from '@angular/core';
import { CostosService } from '../../services/costos.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-costos',
  templateUrl: './costos.component.html',
  styleUrl: './costos.component.css'
})
export class CostosComponent {
  costosList: any = []; // Cambiado 'ingresosList' por 'costosList'
  costosForm: any = this.formBuilder.group({
    nombre: '',
    descripcion: '',
    monto: '',
    fecha: Date
  })
  editableCostos: boolean = false;
  idCostos: any;

  constructor(private CostosService: CostosService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getAllCostos(); // Cambiado 'getAllIngresos' por 'getAllCostos'
  }

  getAllCostos() { // Cambiado 'getAllIngresos' por 'getAllCostos'
    this.CostosService.getAllCostosData().subscribe((data: {}) => {
      this.costosList = data; // Cambiado 'ingresosList' por 'costosList'
    });
  }

  newMessages(messageText: string) {
    this.toastr.success('Clic aquí para actualizar la lista', messageText)
      .onTap
      .pipe(take(1))
      .subscribe(() => window.location.reload());
  }

  newCostoEntry() { // Cambiado 'newIngresoEntry' por 'newCostoEntry'
    this.CostosService.newCosto(localStorage.getItem('accessToken'), this.costosForm.value).subscribe(
      () => {
        this.router.navigate(['/costos']).then(() => { // Cambiado '/ingresos' por '/costos'
          this.newMessages('Registro exitoso');
        })
      }
    );
  }

  deleteCostoEntry(id: any) { // Cambiado 'deleteIngresoEntry' por 'deleteCostoEntry'
    console.log(`Eliminando Costo con ID: ${id}`); // Cambiado 'Ingreso' por 'Costo'
    this.CostosService.deleteCosto(id).subscribe(() => { // Cambiado 'ingresosService' por 'CostosService'
      console.log(`Costo con ID: ${id} eliminado exitosamente.`); // Cambiado 'Ingreso' por 'Costo'
    });
  }
}
