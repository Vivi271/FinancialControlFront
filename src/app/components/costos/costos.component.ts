import { Component } from '@angular/core';
import { CostosService } from '../../services/costos.service';

@Component({
  selector: 'app-costos',
  standalone: false,
  templateUrl: './costos.component.html',
  styleUrl: './costos.component.css'
})
export class CostosComponent {
  costosList: any = [];

  constructor(private costosService: CostosService) { }

  ngOnInit() {
    this.getAllCostos();
  }


  getAllCostos() {
    this.costosService.getAllCostosData().subscribe((data: {}) => {
      this.costosList = data;
    });
  }

  deleteCostoEntry(id: any) {
    console.log(`Eliminando Costo con ID: ${id}`); // Se agrega un comentario indicando que se va a eliminar el Costo
    this.costosService.deleteCosto(id).subscribe(() => {
      console.log(`Costo con ID: ${id} eliminado exitosamente.`); // Confirmación de eliminación exitosa
    });
  }
}
