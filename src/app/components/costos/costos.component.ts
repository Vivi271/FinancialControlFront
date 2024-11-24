import { Component } from '@angular/core';
import { CostosService } from '../../services/costos.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

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
  idUsuario: any;

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
      fechaPago: [new Date().toISOString(), Validators.required],
      usuarioId:[ ]
    });
  }

  getAllCostos() {
    this.costosService.getAllCostosData().subscribe((data: {}) => {
      this.costosList = data;
    });
  }

  ngOnInit() {
    this.idUsuario = localStorage.getItem('id');
    this.getAllCostos();
  }

  newMessage(messageText: string) {
    this.toastr.success('Clic aquí para actualizar la lista', messageText)
      .onTap
      .pipe(take(1))
      .subscribe(() => window.location.reload());
  }

  newCostoEntry() {
    this.costosForm.value['usuarioId'] = this.idUsuario
    console.log(this.costosForm.value['usuarioId'])
    this.costosService.newCosto(this.costosForm.value, localStorage.getItem('accessToken')).subscribe(
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

}