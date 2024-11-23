import { FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  usuariosList: any = [];
  usuariosForm: any = this.formBuilder.group({
    nombre: '',
    cedula: '',
    correo: '',
    clave: '',
    claveConfirmacion: '',
    telefono: '',
    fechaNacimiento: Date
  })
  editableIngresos: boolean = false;
  idIngresos: any;
  constructor(private usuariosService: UsuariosService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getAllUsuarios();
  }


  getAllUsuarios() {
    this.usuariosService.getAllUsuariosData().subscribe((data: {}) => {
      this.usuariosList = data;
    });
  }
  newMessages(messageText: string) {
    this.toastr.success('Clic aquí para actualizar la lista', messageText)
      .onTap
      .pipe(take(1))
      .subscribe(() => window.location.reload());
  }
  newUsuarioEntry() {
    this.usuariosService.newUsuario(localStorage.getItem('accessToken'), this.usuariosForm.value).subscribe(
      () => {
        //Redirigiendo a la ruta actual /animal y recargando la ventana
        this.router.navigate(['/usuarios']).then(() => {
          this.newMessages('Registro exitoso');
        })
      }
    );
  }

  deleteUsuarioEntry(id: any) {
    console.log(`Eliminando usuario con ID: ${id}`); // Se agrega un comentario indicando que se va a eliminar el usuario
    this.usuariosService.deleteUsuario(id).subscribe(() => {
      console.log(`Usuario con ID: ${id} eliminado exitosamente.`); // Confirmación de eliminación exitosa
    });
  }
  

}
