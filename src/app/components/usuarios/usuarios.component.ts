import { Component } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
      cedula: [0],   // Valor numérico por defecto
      correo: [''],  // Valor vacío por defecto
      clave: [''],   // Valor vacío por defecto
      claveConfirmacion: [''], // Valor vacío por defecto
      telefono: [0], // Valor numérico por defecto
      fechaNacimiento: [new Date()] // Usamos new Date() para obtener la fecha actual
    });
  }



  getAllUsuarios() {
    this.usuariosService.getAllUsuariosData().subscribe((data: {}) => {
      this.usuariosList = data;
    });
  }

  ngOnInit() {
    this.getAllUsuarios();
  }

  newMessage(messageText: string) {
    this.toastr.success('Clic aquí para actualizar la lista', messageText)
      .onTap
      .pipe(take(1))
      .subscribe(() => window.location.reload());
  }

}