import { Component } from '@angular/core';
import { GastosService } from '../../services/gastos.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';


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
  idUsuario: any;

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

  obtenerTamanoArreglo() {     return this.gastosList.length; }

  getAllGastos() {
    this.gastosService.getAllGastosData().subscribe((data: {}) => {
      this.gastosList = data;
    });
  }

  ngOnInit() {
    this.idUsuario = localStorage.getItem('id');
    this.getAllGastos();
  }

  newMessage(messageText: string) {
    this.toastr.success('Clic aquí para actualizar la lista', messageText)
      .onTap
      .pipe(take(1))
      .subscribe(() => window.location.reload());
  }

  newGastoEntry() {
    this.gastosForm.value['usuarioId'] = this.idUsuario
    this.gastosService.newGasto(this.gastosForm.value, localStorage.getItem('accessToken')).subscribe(
      () => {
        this.router.navigate(['/gastos']).then(() => {
          this.newMessage('Registro exitoso');
        })
      }
    );
  }
  updateGastoEntry() {
    for (let key in this.gastosForm.value) {
      if (this.gastosForm.value[key] === '') {
        this.gastosForm.removeControl(key);
      }
    }
    this.gastosService.updateGasto(localStorage.getItem('accessToken'), this.idGasto, this.gastosForm.value).subscribe(
      () => {
        //Enviando mensaje de confirmación
        this.newMessage("gasto editado");
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

  toggleEditGasto(id: any) {
    this.idGasto = id;
    console.log(this.idGasto)
    this.gastosService.getOneGasto(id).subscribe(
      data => {
        this.gastosForm.setValue({
          nombre: data.nombre,
          edad: data.edad,
          tipo: data.tipo,
          fecha: this.getValidDate(data.fecha)
        });
      }
    );
    this.editableGastos = !this.editableGastos;
  }

  deleteGastoEntry(id: any) {
    this.idGasto = id;
    this.gastosService.deleteGasto(localStorage.getItem('accessToken'), this.idGasto).subscribe(
      () => {
        //Enviando mensaje de confirmación
        this.newMessage("gasto eliminado");
      }
    );
  }

}