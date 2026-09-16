import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.scss'
})
export class Shell {
  navItems = [
    { label: 'Dashboard', icon: 'layout-dashboard', route: '/dashboard' },
    { label: 'Productos', icon: 'package', route: '/productos' },
    { label: 'Categorías', icon: 'category', route: '/categorias' },
    { label: 'Proveedores', icon: 'truck', route: '/proveedores' },
    { label: 'Movimientos', icon: 'transfer', route: '/movimientos' },
    { label: 'Usuarios', icon: 'users', route: '/usuarios' },
  ];
}