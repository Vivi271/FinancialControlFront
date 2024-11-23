import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CostosComponent } from './components/costos/costos.component';
import { GastosComponent } from './components/gastos/gastos.component';
import { IngresosComponent } from './components/ingresos/ingresos.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

import { SignupComponent } from './authentication/signup/signup.component';
import { LoginComponent } from './authentication/login/login.component';
import path from 'path';
import { InicioComponent } from './components/inicio/inicio.component';

const routes: Routes = [
  {path : 'costos', component:CostosComponent},
  {path : 'gastos', component:GastosComponent},
  {path : 'ingresos', component:IngresosComponent},
  {path : 'usuarios', component:UsuariosComponent},
  {path: 'signup',component: SignupComponent},
  {path: 'login',component: LoginComponent},
 // {path: 'logout',component: AppComponent},
  {path : '', component:LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
