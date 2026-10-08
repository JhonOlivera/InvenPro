import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../usuario.service';
import { Usuario } from '../../../shared/models/usuario.model';
import { obtenerMensajesError } from '../../../shared/utils/http-error.util';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.scss'
})
export class UsuarioForm implements OnInit {
  private usuarioService = inject(UsuarioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private id: number | null = null;
  modoEdicion = false;

  usuario: Usuario = { nombre: '', email: '', password: '', rol: 'EMPLEADO' };

  cargando = signal(false);
  guardando = signal(false);
  errores = signal<string[]>([]);

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.modoEdicion = true;
      this.id = Number(idParam);
      this.cargando.set(true);
      this.usuarioService.getById(this.id).subscribe({
        next: (data) => {
          // El backend nunca devuelve password (write-only); se deja vacía
          // a propósito para que "no cambiarla" sea el estado por defecto.
          this.usuario = { ...data, password: '' };
          this.cargando.set(false);
        },
        error: (err) => {
          this.errores.set(obtenerMensajesError(err, 'No se pudo cargar el usuario.'));
          this.cargando.set(false);
        }
      });
    }
  }

  onSubmit() {
    this.errores.set([]);
    this.guardando.set(true);

    const payload: Usuario = { ...this.usuario };
    if (this.modoEdicion && !payload.password) {
      delete payload.password;
    }

    const peticion = this.modoEdicion && this.id !== null
      ? this.usuarioService.update(this.id, payload)
      : this.usuarioService.create(payload);

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.router.navigate(['/usuarios']);
      },
      error: (err) => {
        this.guardando.set(false);
        this.errores.set(obtenerMensajesError(err, 'No se pudo guardar el usuario.'));
      }
    });
  }
}
