import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoriaService } from '../categoria.service';
import { Categoria } from '../../../shared/models/categoria.model';
import { obtenerMensajesError } from '../../../shared/utils/http-error.util';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './categoria-form.html',
  styleUrl: './categoria-form.scss'
})
export class CategoriaForm implements OnInit {
  private categoriaService = inject(CategoriaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private id: number | null = null;
  modoEdicion = false;

  categoria: Categoria = { nombre: '', descripcion: '' };

  cargando = signal(false);
  guardando = signal(false);
  errores = signal<string[]>([]);

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.modoEdicion = true;
      this.id = Number(idParam);
      this.cargando.set(true);
      this.categoriaService.getById(this.id).subscribe({
        next: (data) => {
          this.categoria = data;
          this.cargando.set(false);
        },
        error: (err) => {
          this.errores.set(obtenerMensajesError(err, 'No se pudo cargar la categoría.'));
          this.cargando.set(false);
        }
      });
    }
  }

  onSubmit() {
    this.errores.set([]);
    this.guardando.set(true);

    const peticion = this.modoEdicion && this.id !== null
      ? this.categoriaService.update(this.id, this.categoria)
      : this.categoriaService.create(this.categoria);

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.router.navigate(['/categorias']);
      },
      error: (err) => {
        this.guardando.set(false);
        this.errores.set(obtenerMensajesError(err, 'No se pudo guardar la categoría.'));
      }
    });
  }
}
