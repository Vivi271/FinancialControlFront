import { Component } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  usuariosList: any = [];
  constructor(private usuariosService: UsuariosService) { }

  ngOnInit() {
    this.getAllUsuarios();
  }


  getAllUsuarios() {
    this.usuariosService.getAllUsuariosData().subscribe((data: {}) => {
      this.usuariosList = data;
    });
  }

  deleteUsuarioEntry(id: any) {
    console.log(`Eliminando usuario con ID: ${id}`); // Se agrega un comentario indicando que se va a eliminar el usuario
    this.usuariosService.deleteUsuario(id).subscribe(() => {
      console.log(`Usuario con ID: ${id} eliminado exitosamente.`); // Confirmación de eliminación exitosa
    });
  }
  

}
