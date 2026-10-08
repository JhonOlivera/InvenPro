import { Routes } from '@angular/router';
import { Shell } from './core/shell/shell';
import { authGuard } from './core/shell/guards/auth.guard';
import { adminGuard } from './core/shell/guards/admin.guard';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { ProductoList } from './features/productos/producto-list/producto-list';
import { ProductoForm } from './features/productos/producto-form/producto-form';
import { CategoriaList } from './features/categorias/categoria-list/categoria-list';
import { CategoriaForm } from './features/categorias/categoria-form/categoria-form';
import { ProveedorList } from './features/proveedores/proveedor-list/proveedor-list';
import { ProveedorForm } from './features/proveedores/proveedor-form/proveedor-form';
import { MovimientoList } from './features/movimientos/movimiento-list/movimiento-list';
import { MovimientoForm } from './features/movimientos/movimiento-form/movimiento-form';
import { UsuarioList } from './features/usuarios/usuario-list/usuario-list';
import { UsuarioForm } from './features/usuarios/usuario-form/usuario-form';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'productos', component: ProductoList },
      { path: 'productos/nuevo', component: ProductoForm },
      { path: 'productos/:id/editar', component: ProductoForm },
      { path: 'categorias', component: CategoriaList },
      { path: 'categorias/nuevo', component: CategoriaForm },
      { path: 'categorias/:id/editar', component: CategoriaForm },
      { path: 'proveedores', component: ProveedorList },
      { path: 'proveedores/nuevo', component: ProveedorForm },
      { path: 'proveedores/:id/editar', component: ProveedorForm },
      { path: 'movimientos', component: MovimientoList },
      { path: 'movimientos/nuevo', component: MovimientoForm },
      { path: 'usuarios', component: UsuarioList, canActivate: [adminGuard] },
      { path: 'usuarios/nuevo', component: UsuarioForm, canActivate: [adminGuard] },
      { path: 'usuarios/:id/editar', component: UsuarioForm, canActivate: [adminGuard] },
    ]
  }
];