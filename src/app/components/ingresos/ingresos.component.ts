import { Component } from '@angular/core';
import { IngresosService } from '../../services/ingresos.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ingresos',
  standalone: false,

  templateUrl: './ingresos.component.html',
  styleUrl: './ingresos.component.css'
})
export class IngresosComponent {

  ingresosList: any = [];
  ingresosForm!: FormGroup;
  editableIngreso: boolean = false;
  idIngreso: any;
  isLoading = false; // Indicador de carga

  constructor(private ingresosService: IngresosService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) { }



  getAllIngresos() {
    this.ingresosService.getAllIngresosData().subscribe((data: {}) => {
      this.ingresosList = data;
    });
  }

  ngOnInit() {
    this.getAllIngresos();
  }

  newMessage(messageText: string) {
    this.toastr.success('Clic aquí para actualizar la lista', messageText)
      .onTap
      .pipe(take(1))
      .subscribe(() => window.location.reload());
  }

  newIngresoEntry() {
    this.ingresosService.newIngreso(this.ingresosForm.value).subscribe(
      () => {
        this.router.navigate(['/ingreso']).then(() => {
          this.newMessage('Registro exitoso');
        })
      }
    );
  }



}