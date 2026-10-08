import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './service/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  soloAdmin?: boolean;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.scss'
})
export class Shell {
  private authService = inject(AuthService);
  private router = inject(Router);

  usuario = this.authService.currentUser;

  private navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'layout-dashboard', route: '/dashboard' },
    { label: 'Productos', icon: 'package', route: '/productos' },
    { label: 'Categorías', icon: 'category', route: '/categorias' },
    { label: 'Proveedores', icon: 'truck', route: '/proveedores' },
    { label: 'Movimientos', icon: 'transfer', route: '/movimientos' },
    { label: 'Usuarios', icon: 'users', route: '/usuarios', soloAdmin: true },
  ];

  // UsuarioController exige ROLE_ADMIN en el backend; este link solo tiene
  // sentido mostrarlo a quien realmente puede usarlo.
  navItemsVisibles = computed(() =>
    this.navItems.filter((item) => !item.soloAdmin || this.usuario()?.rol === 'ADMIN')
  );

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
