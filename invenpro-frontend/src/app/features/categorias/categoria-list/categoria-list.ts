import { Component, inject, signal } from '@angular/core';
import { CategoriaService } from '../categoria.service';
import { Categoria } from '../../../shared/models/categoria.model';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [],
  templateUrl: './categoria-list.html',
  styleUrl: './categoria-list.scss'
})
export class CategoriaList {
  private categoriaService = inject(CategoriaService);
  categorias = signal<Categoria[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.categoriaService.getAll().subscribe({
      next: (data) => {
        this.categorias.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set('No se pudo conectar con el backend. ¿Está corriendo en el puerto 8080?');
        this.cargando.set(false);
        console.error(err);
      }
    });
  }
}