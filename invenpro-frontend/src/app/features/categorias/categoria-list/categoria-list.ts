import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoriaService } from '../categoria.service';
import { Categoria } from '../../../shared/models/categoria.model';
import { ConfirmService } from '../../../shared/services/confirm.service';
import { obtenerMensajesError } from '../../../shared/utils/http-error.util';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categoria-list.html',
  styleUrl: './categoria-list.scss'
})
export class CategoriaList implements OnInit {
  private categoriaService = inject(CategoriaService);
  private confirmService = inject(ConfirmService);

  categorias = signal<Categoria[]>([]);
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
    this.categoriaService.getAll().subscribe({
      next: (data) => {
        this.categorias.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(obtenerMensajesError(err, 'No se pudo cargar las categorías.')[0]);
        this.cargando.set(false);
      }
    });
  }

  async eliminar(categoria: Categoria) {
    const confirmado = await this.confirmService.confirm({
      titulo: 'Eliminar categoría',
      mensaje: `¿Seguro que quieres eliminar "${categoria.nombre}"? Esta acción no se puede deshacer.`,
      textoConfirmar: 'Eliminar',
      peligro: true
    });
    if (!confirmado) {
      return;
    }

    this.errorEliminar.set(null);
    this.eliminandoId.set(categoria.id!);
    this.categoriaService.delete(categoria.id!).subscribe({
      next: () => {
        this.categorias.update((lista) => lista.filter((c) => c.id !== categoria.id));
        this.eliminandoId.set(null);
      },
      error: (err) => {
        this.errorEliminar.set(obtenerMensajesError(err, 'No se pudo eliminar la categoría.')[0]);
        this.eliminandoId.set(null);
      }
    });
  }
}
