import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './service/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  soloAdmin?: boolean;
}

interface NavGrupo {
  etiqueta: string;
  items: NavItem[];
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
  menuAbierto = signal(false);
  tituloPagina = signal('');

  inicial = computed(() => (this.usuario()?.nombre ?? '?').trim().charAt(0).toUpperCase() || '?');

  private grupos: NavGrupo[] = [
    {
      etiqueta: 'Inventario',
      items: [
        { label: 'Catálogo', icon: 'layout-grid', route: '/catalogo' },
        { label: 'Productos', icon: 'package', route: '/productos' },
        { label: 'Categorías', icon: 'category', route: '/categorias' },
        { label: 'Proveedores', icon: 'truck', route: '/proveedores' },
        { label: 'Movimientos', icon: 'transfer', route: '/movimientos' },
      ]
    },
    {
      etiqueta: 'Sistema',
      items: [
        { label: 'Usuarios', icon: 'users', route: '/usuarios', soloAdmin: true },
      ]
    }
  ];

  // UsuarioController exige ROLE_ADMIN en el backend; este link solo tiene
  // sentido mostrarlo a quien realmente puede usarlo.
  gruposVisibles = computed<NavGrupo[]>(() =>
    this.grupos
      .map((grupo) => ({
        etiqueta: grupo.etiqueta,
        items: grupo.items.filter((item) => !item.soloAdmin || this.usuario()?.rol === 'ADMIN')
      }))
      .filter((grupo) => grupo.items.length > 0)
  );

  constructor() {
    this.router.events
      .pipe(filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd))
      .subscribe(() => this.actualizarTitulo());
    this.actualizarTitulo();
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.menuAbierto.update((abierto) => !abierto);
  }

  // Cierra el menú de usuario al hacer clic en cualquier otro lugar de la página.
  // toggleMenu() detiene la propagación de su propio clic, así que este
  // listener no se dispara en el mismo evento que abre el menú.
  @HostListener('document:click')
  cerrarMenu() {
    this.menuAbierto.set(false);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private actualizarTitulo() {
    // this.route.firstChild (la ActivatedRoute del propio Shell) todavía no
    // tiene las rutas hijas activadas en el momento del constructor; en
    // cambio router.routerState.snapshot siempre refleja el árbol completo
    // y vigente, sin importar cuándo se lea.
    let snapshot = this.router.routerState.snapshot.root;
    while (snapshot.firstChild) {
      snapshot = snapshot.firstChild;
    }
    this.tituloPagina.set(snapshot.data['title'] ?? 'InvenPro');
  }
}
