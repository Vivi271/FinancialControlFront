import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'] // Corrección: styleUrls en plural
})
export class UsuariosComponent implements OnInit {
  usuariosList: any[] = []; // Mejor tipado de datos
  usuariosForm: FormGroup; // Uso de FormGroup para formularios reactivos
  editableIngresos: boolean = false;
  idIngresos: any;

  constructor(
    private usuariosService: UsuariosService,
    private formBuilder: FormBuilder, // Corrección: renombrar "fromBuilder" a "formBuilder"
    private router: Router,
    private toastr: ToastrService
  ) {
    // Inicialización del formulario en el constructor
    this.usuariosForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      cedula: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      claveConfirmacion: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      fechaNacimiento: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.getAllUsuarios();
  }

  // Método para obtener todos los usuarios
  getAllUsuarios() {
    this.usuariosService.getAllUsuariosData().subscribe((data: any) => {
      this.usuariosList = data;
    });
  }

  // Método para mostrar mensajes con Toastr
  newMessages(messageText: string) {
    this.toastr
      .success('Clic aquí para actualizar la lista', messageText)
      .onTap.pipe(take(1))
      .subscribe(() => window.location.reload());
  }
}
