import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../usuario.service';
import { Usuario } from '../../../shared/models/usuario.model';
import { AuthService } from '../../../core/shell/service/auth.service';
import { ConfirmService } from '../../../shared/services/confirm.service';
import { obtenerMensajesError } from '../../../shared/utils/http-error.util';
import { PageHeader } from '../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [RouterLink, PageHeader],
  templateUrl: './usuario-list.html',
  styleUrl: './usuario-list.scss'
})
export class UsuarioList implements OnInit {
  private usuarioService = inject(UsuarioService);
  private confirmService = inject(ConfirmService);
  private authService = inject(AuthService);

  usuarios = signal<Usuario[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);
  errorEliminar = signal<string | null>(null);
  eliminandoId = signal<number | null>(null);

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.error.set(null);
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(obtenerMensajesError(err, 'No se pudo cargar los usuarios.')[0]);
        this.cargando.set(false);
      }
    });
  }

  esUsuarioActual(usuario: Usuario): boolean {
    return usuario.email === this.authService.currentUser()?.email;
  }

  async eliminar(usuario: Usuario) {
    if (this.esUsuarioActual(usuario)) {
      return;
    }

    const confirmado = await this.confirmService.confirm({
      titulo: 'Eliminar usuario',
      mensaje: `¿Seguro que quieres eliminar a "${usuario.nombre}"? Esta acción no se puede deshacer.`,
      textoConfirmar: 'Eliminar',
      peligro: true
    });
    if (!confirmado) {
      return;
    }

    this.errorEliminar.set(null);
    this.eliminandoId.set(usuario.id!);
    this.usuarioService.delete(usuario.id!).subscribe({
      next: () => {
        this.usuarios.update((lista) => lista.filter((u) => u.id !== usuario.id));
        this.eliminandoId.set(null);
      },
      error: (err) => {
        this.errorEliminar.set(obtenerMensajesError(err, 'No se pudo eliminar el usuario.')[0]);
        this.eliminandoId.set(null);
      }
    });
  }
}
