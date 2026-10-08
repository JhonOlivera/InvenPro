import { Routes } from '@angular/router';
import { Shell } from './core/shell/shell';
import { authGuard } from './core/shell/guards/auth.guard';
import { adminGuard } from './core/shell/guards/admin.guard';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { Catalogo } from './features/catalogo/catalogo';
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
      { path: 'dashboard', component: Dashboard, data: { title: 'Dashboard' } },
      { path: 'catalogo', component: Catalogo, data: { title: 'Catálogo' } },
      { path: 'productos', component: ProductoList, data: { title: 'Productos' } },
      { path: 'productos/nuevo', component: ProductoForm, data: { title: 'Nuevo producto' } },
      { path: 'productos/:id/editar', component: ProductoForm, data: { title: 'Editar producto' } },
      { path: 'categorias', component: CategoriaList, data: { title: 'Categorías' } },
      { path: 'categorias/nuevo', component: CategoriaForm, data: { title: 'Nueva categoría' } },
      { path: 'categorias/:id/editar', component: CategoriaForm, data: { title: 'Editar categoría' } },
      { path: 'proveedores', component: ProveedorList, data: { title: 'Proveedores' } },
      { path: 'proveedores/nuevo', component: ProveedorForm, data: { title: 'Nuevo proveedor' } },
      { path: 'proveedores/:id/editar', component: ProveedorForm, data: { title: 'Editar proveedor' } },
      { path: 'movimientos', component: MovimientoList, data: { title: 'Movimientos' } },
      { path: 'movimientos/nuevo', component: MovimientoForm, data: { title: 'Registrar movimiento' } },
      { path: 'usuarios', component: UsuarioList, canActivate: [adminGuard], data: { title: 'Usuarios' } },
      { path: 'usuarios/nuevo', component: UsuarioForm, canActivate: [adminGuard], data: { title: 'Nuevo usuario' } },
      { path: 'usuarios/:id/editar', component: UsuarioForm, canActivate: [adminGuard], data: { title: 'Editar usuario' } },
    ]
  }
];
