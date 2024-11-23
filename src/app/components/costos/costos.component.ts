import { Component } from '@angular/core';
import { CostosService } from '../../services/costos.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-costos',
  standalone: false,
  templateUrl: './costos.component.html',
  styleUrls: ['./costos.component.css']
})
export class CostosComponent {

  costosList: any = [];
  costosForm!: FormGroup;
  editableCosto: boolean = false;
  idCosto: any;
  isLoading = false; // Indicador de carga

  constructor(
    private costosService: CostosService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.costosForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.maxLength(200)],
      monto: [0, [Validators.required, Validators.min(0)]],
      fechaPago: [new Date().toISOString(), Validators.required]
    });
  }

  getAllCostos() {
    this.costosService.getAllCostosData().subscribe((data: {}) => {
      this.costosList = data;
    });
  }

  ngOnInit() {
    this.getAllCostos();
  }

  newMessage(messageText: string) {
    this.toastr.success('Clic aquí para actualizar la lista', messageText)
      .onTap
      .pipe(take(1))
      .subscribe(() => window.location.reload());
  }

  newCostoEntry() {
    this.costosService.newCosto(this.costosForm.value).subscribe(
      () => {
        this.router.navigate(['/costos']).then(() => {
          this.newMessage('Registro exitoso');
        })
      }
    );
  }

  updateAnimalEntry() {
        for (let key in this.costosForm.value) {
      if (this.costosForm.value[key] === '') {
        this.costosForm.removeControl(key);
      }
    }
    this.costosService.updateCosto(this.idCosto, this.costosForm.value).subscribe(
      () => {
        //Enviando mensaje de confirmación
        this.newMessage("costo editado");
      }
    );
  }

}