import { Routes } from '@angular/router';
import { Shell } from './core/shell/shell';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { ProductoList } from './features/productos/producto-list/producto-list';
import { CategoriaList } from './features/categorias/categoria-list/categoria-list';
import { ProveedorList } from './features/proveedores/proveedor-list/proveedor-list';
import { MovimientoList } from './features/movimientos/movimiento-list/movimiento-list';
import { UsuarioList } from './features/usuarios/usuario-list/usuario-list';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'productos', component: ProductoList },
      { path: 'categorias', component: CategoriaList },
      { path: 'proveedores', component: ProveedorList },
      { path: 'movimientos', component: MovimientoList },
      { path: 'usuarios', component: UsuarioList },
    ]
  }
];