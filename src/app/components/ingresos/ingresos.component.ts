import { Component } from '@angular/core';
import { IngresosService } from '../../services/ingresos.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-ingresos',
  standalone: false,
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css']
})
export class IngresosComponent {

  ingresosList: any = [];
  ingresosForm!: FormGroup;
  editableIngreso: boolean = false;
  idIngreso: any;
  isLoading = false; // Indicador de carga
  idUsuario: any;

  constructor(
    private ingresosService: IngresosService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.ingresosForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.maxLength(200)],
      monto: [0, [Validators.required, Validators.min(0)]],
      fechaPago: [new Date().toISOString(), Validators.required],
      usuarioId: []
    });
  }

  getAllIngresos() {
    this.ingresosService.getAllIngresosData().subscribe((data: {}) => {
      this.ingresosList = data;
    });
  }

  ngOnInit() {
    this.idUsuario = localStorage.getItem('id');
    this.getAllIngresos();
  }

  newMessage(messageText: string) {
    this.toastr.success('Clic aquí para actualizar la lista', messageText)
      .onTap
      .pipe(take(1))
      .subscribe(() => window.location.reload());
  }

  newIngresoEntry() {
    this.ingresosForm.value['usuarioId'] = this.idUsuario;
    this.ingresosService.newIngreso(this.ingresosForm.value, localStorage.getItem('accessToken')).subscribe(
      () => {
        this.router.navigate(['/ingresos']).then(() => {
          this.newMessage('Registro exitoso');
        });
      }
    );
  }

  updateIngresoEntry() {
    for (let key in this.ingresosForm.value) {
      if (this.ingresosForm.value[key] === '') {
        this.ingresosForm.removeControl(key);
      }
    }
    this.ingresosService.updateIngreso(localStorage.getItem('accessToken'), this.idIngreso, this.ingresosForm.value).subscribe(
      () => {
        //Enviando mensaje de confirmación
        this.newMessage("ingreso editado");
      }
    );
  }
  getValidDate(fecha: Date) {
    const fechaFinal: Date = new Date(fecha);
    //separado los datos
    var dd = fechaFinal.getDate() + 1;//fue necesario porque siempre daba un día antes
    var mm = fechaFinal.getMonth() + 1; //porque Enero es 0
    var yyyy = fechaFinal.getFullYear();
    var mes = '';
    var dia = '';
    //Como algunos meses tienen 31 días dd puede dar 32
    if (dd == 32) {
      dd = 1;
      mm++;
    }
    //Transformación de fecha cuando el día o mes son menores a 10
    //se le coloca un cero al inicio
    //Día
    if (dd < 10) {
      dia += `0${dd}`;
    } else {
      dia += `${dd}`;
    }
    //Mes
    if (mm < 10) {
      mes += `0${mm}`;
    } else {
      mes += `${mm}`;
    }
    //formatDate para colocar la fecha en un formato aceptado por el calendario
    //GMT-0500 es para Colombia
    var finalDate = formatDate(new Date(yyyy + '-' + mes + '-' + dia + ' GMT-0500'), 'yyyy-MM-dd', "en-US");
    return finalDate;
  }

  toggleEditIngreso(id: any) {
    this.idIngreso = id;
    console.log(this.idIngreso)
    this.ingresosService.getOneIngreso(id).subscribe(
      data => {
        this.ingresosForm.setValue({
          nombre: data.nombre,
          edad: data.edad,
          tipo: data.tipo,
          fecha: this.getValidDate(data.fecha)
        });
      }
    );
    this.editableIngreso = !this.editableIngreso;
  }

  deleteIngresoEntry(id: any) {
    this.idIngreso = id;
    this.ingresosService.deleteIngreso(localStorage.getItem('accessToken'), this.idIngreso).subscribe(
      () => {
        //Enviando mensaje de confirmación
        this.newMessage("Ingreso eliminado");
      }
    );
  }


}