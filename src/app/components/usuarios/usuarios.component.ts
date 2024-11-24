import { Component } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  standalone: false,

  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  usuariosList: any = [];
  usuariosForm!: FormGroup;
  editableUsuario: boolean = false;
  idUsuario: any;
  isLoading = false; // Indicador de carga

  constructor(
    private usuariosService: UsuariosService, 
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.usuariosForm = this.formBuilder.group({
      nombre: [''], // Usamos un arreglo con el valor inicial
      cedula: [],   // Valor numérico por defecto
      correo: [''],  // Valor vacío por defecto
      clave: [''],   // Valor vacío por defecto
      claveConfirmacion: [''], // Valor vacío por defecto
      telefono: [], // Valor numérico por defecto
      fechaNacimiento: [new Date()] // Usamos new Date() para obtener la fecha actual
    });
  }



  getAllUsuarios() {
    this.usuariosService.getAllUsuariosData().subscribe((data: {}) => {
      this.usuariosList = data;
    });
  }

  ngOnInit() {
    this.idUsuario = localStorage.getItem('id');
    this.getAllUsuarios();
  }

  newMessage(messageText: string) {
    this.toastr.success('Clic aquí para actualizar la lista', messageText)
      .onTap
      .pipe(take(1))
      .subscribe(() => window.location.reload());
  }

  newUsuarioEntry() {
    this.usuariosService.newUsuario(this.usuariosForm.value).subscribe(
      () => {
        this.router.navigate(['/usuario']).then(() => {
          this.newMessage('Registro exitoso');
        })
      }
    );
  }

  updateUsuarioEntry() {
    for (let key in this.usuariosForm.value) {
      if (this.usuariosForm.value[key] === '') {
        this.usuariosForm.removeControl(key);
      }
    }
    this.usuariosService.updateUsuario(localStorage.getItem('accessToken'), this.idUsuario, this.usuariosForm.value).subscribe(
      () => {
        //Enviando mensaje de confirmación
        this.newMessage("Usuario editado");
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

  toggleEditUsuario(id: any) {
    this.idUsuario = id;
    console.log(this.idUsuario)
    this.usuariosService.getOneUsuario(id).subscribe(
      data => {
        this.usuariosForm.setValue({
          nombre: data.nombre,
          edad: data.edad,
          tipo: data.tipo,
          fecha: this.getValidDate(data.fecha)
        });
      }
    );
    this.editableUsuario = !this.editableUsuario;
  }

  deleteUsuarioEntry(id: any) {
    this.idUsuario = id;
    this.usuariosService.deleteUsuario(localStorage.getItem('accessToken'), this.idUsuario).subscribe(
      () => {
        //Enviando mensaje de confirmación
        this.newMessage("Usuario eliminado");
      }
    );
  }


}
