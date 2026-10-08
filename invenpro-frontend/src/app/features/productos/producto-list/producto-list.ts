import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../producto.service';
import { Producto } from '../../../shared/models/producto.model';
import { ConfirmService } from '../../../shared/services/confirm.service';
import { obtenerMensajesError } from '../../../shared/utils/http-error.util';
import { calcularEstadoStock, ETIQUETA_ESTADO_STOCK, EstadoStock } from '../../../shared/utils/stock.util';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ImageFallback } from '../../../shared/components/image-fallback/image-fallback';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [RouterLink, DecimalPipe, FormsModule, PageHeader, ImageFallback],
  templateUrl: './producto-list.html',
  styleUrl: './producto-list.scss'
})
export class ProductoList implements OnInit {
  private productoService = inject(ProductoService);
  private confirmService = inject(ConfirmService);

  productos = signal<Producto[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);
  errorEliminar = signal<string | null>(null);
  eliminandoId = signal<number | null>(null);
  busqueda = signal('');

  productosFiltrados = computed(() => {
    const termino = this.busqueda().trim().toLowerCase();
    if (!termino) {
      return this.productos();
    }
    return this.productos().filter((producto) =>
      producto.nombre.toLowerCase().includes(termino) ||
      (producto.codigo ?? '').toLowerCase().includes(termino) ||
      (producto.categoriaNombre ?? '').toLowerCase().includes(termino)
    );
  });

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.error.set(null);
    this.productoService.getAll().subscribe({
      next: (data) => {
        this.productos.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(obtenerMensajesError(err, 'No se pudo cargar los productos.')[0]);
        this.cargando.set(false);
      }
    });
  }

  estadoStock(producto: Producto): EstadoStock {
    return calcularEstadoStock(producto.stock, producto.stockMinimo);
  }

  etiquetaEstadoStock(producto: Producto): string {
    return ETIQUETA_ESTADO_STOCK[this.estadoStock(producto)];
  }

  async eliminar(producto: Producto) {
    const confirmado = await this.confirmService.confirm({
      titulo: 'Eliminar producto',
      mensaje: `¿Seguro que quieres eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`,
      textoConfirmar: 'Eliminar',
      peligro: true
    });
    if (!confirmado) {
      return;
    }

    this.errorEliminar.set(null);
    this.eliminandoId.set(producto.id!);
    this.productoService.delete(producto.id!).subscribe({
      next: () => {
        this.productos.update((lista) => lista.filter((p) => p.id !== producto.id));
        this.eliminandoId.set(null);
      },
      error: (err) => {
        this.errorEliminar.set(obtenerMensajesError(err, 'No se pudo eliminar el producto.')[0]);
        this.eliminandoId.set(null);
      }
    });
  }
}
