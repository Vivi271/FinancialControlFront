import { Component } from '@angular/core';
import { IngresosService } from '../../services/ingresos.service';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrl: './ingresos.component.css'
})
export class IngresosComponent {
  ingresosList: any = [];
  constructor(private ingresosService: IngresosService) { }

  ngOnInit() {
    this.getAllIngresos();
  }

  getAllIngresos() {
    this.ingresosService.getAllIngresosData().subscribe((data: {}) => {
      this.ingresosList = data;
    });
  }


  deleteIngresoEntry(id: any) {
    console.log(`Eliminando Ingreso con ID: ${id}`); // Se agrega un comentario indicando que se va a eliminar el ingreso
    this.ingresosService.deleteIngreso(id).subscribe(() => {
      console.log(`Ingreso con ID: ${id} eliminado exitosamente.`); // Confirmación de eliminación exitosa
    });
  }
  
}
