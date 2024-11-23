import { Component } from '@angular/core';
import { GastosService } from '../../services/gastos.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-gastos',
  standalone: false,

  templateUrl: './gastos.component.html',
  styleUrl: './gastos.component.css'
})
export class GastosComponent {
  gastosList: any = [];
  gastosForm!: FormGroup;
  editableGastos: boolean = false;
  idGasto: any;
  isLoading = false; // Indicador de carga

  constructor(private gastosService: GastosService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) { this.gastosForm = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', Validators.maxLength(200)],
    monto: [0, [Validators.required, Validators.min(0)]],
    fechaGasto: [new Date().toISOString(), Validators.required]
  });}

  getAllGastos() {
    this.gastosService.getAllGastosData().subscribe((data: {}) => {
      this.gastosList = data;
    });
  }

  ngOnInit() {
    this.getAllGastos();
  }

  newMessage(messageText: string) {
    this.toastr.success('Clic aquí para actualizar la lista', messageText)
      .onTap
      .pipe(take(1))
      .subscribe(() => window.location.reload());
  }

  newGastoEntry() {
    this.gastosService.newGasto(this.gastosForm.value).subscribe(
      () => {
        this.router.navigate(['/gastos']).then(() => {
          this.newMessage('Registro exitoso');
        })
      }
    );
  }
}