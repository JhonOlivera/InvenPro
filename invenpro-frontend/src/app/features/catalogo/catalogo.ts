import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../productos/producto.service';
import { CategoriaService } from '../categorias/categoria.service';
import { Producto } from '../../shared/models/producto.model';
import { Categoria } from '../../shared/models/categoria.model';
import { obtenerMensajesError } from '../../shared/utils/http-error.util';
import { calcularEstadoStock, ETIQUETA_ESTADO_STOCK, EstadoStock } from '../../shared/utils/stock.util';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { ImageFallback } from '../../shared/components/image-fallback/image-fallback';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [RouterLink, DecimalPipe, FormsModule, PageHeader, ImageFallback],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.scss'
})
export class Catalogo implements OnInit {
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);

  productos = signal<Producto[]>([]);
  categorias = signal<Categoria[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  categoriaSeleccionada = signal<number | null>(null);
  busqueda = signal('');
  productoDetalle = signal<Producto | null>(null);

  productosFiltrados = computed(() => {
    const categoriaId = this.categoriaSeleccionada();
    const termino = this.busqueda().trim().toLowerCase();
    return this.productos().filter((producto) => {
      const coincideCategoria = categoriaId === null || producto.categoriaId === categoriaId;
      const coincideBusqueda = !termino ||
        producto.nombre.toLowerCase().includes(termino) ||
        (producto.codigo ?? '').toLowerCase().includes(termino);
      return coincideCategoria && coincideBusqueda;
    });
  });

  tituloSeccion = computed(() => {
    const categoriaId = this.categoriaSeleccionada();
    if (categoriaId === null) {
      return 'Todos los productos';
    }
    return this.categorias().find((c) => c.id === categoriaId)?.nombre ?? 'Productos';
  });

  ngOnInit() {
    this.cargando.set(true);
    this.error.set(null);

    // El panel de categorías es una ayuda de navegación, no algo crítico: si
    // falla, el catálogo sigue funcionando solo con "Todos los productos".
    this.categoriaService.getAll().subscribe({
      next: (data) => this.categorias.set(data),
      error: () => {}
    });

    this.productoService.getAll().subscribe({
      next: (data) => {
        this.productos.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(obtenerMensajesError(err, 'No se pudo cargar el catálogo.')[0]);
        this.cargando.set(false);
      }
    });
  }

  seleccionarCategoria(id: number | null) {
    this.categoriaSeleccionada.set(id);
  }

  estadoStock(producto: Producto): EstadoStock {
    return calcularEstadoStock(producto.stock, producto.stockMinimo);
  }

  etiquetaEstadoStock(producto: Producto): string {
    return ETIQUETA_ESTADO_STOCK[this.estadoStock(producto)];
  }

  verDetalle(producto: Producto) {
    this.productoDetalle.set(producto);
  }

  cerrarDetalle() {
    this.productoDetalle.set(null);
  }
}
