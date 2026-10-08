import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MovimientoService } from '../movimiento.service';
import { ProductoService } from '../../productos/producto.service';
import { Movimiento } from '../../../shared/models/movimiento.model';
import { Producto } from '../../../shared/models/producto.model';
import { obtenerMensajesError } from '../../../shared/utils/http-error.util';

@Component({
  selector: 'app-movimiento-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './movimiento-form.html',
  styleUrl: './movimiento-form.scss'
})
export class MovimientoForm implements OnInit {
  private movimientoService = inject(MovimientoService);
  private productoService = inject(ProductoService);

  movimiento: Movimiento = { productoId: 0, tipo: 'ENTRADA', cantidad: 1 };

  productos = signal<Producto[]>([]);
  cargandoProductos = signal(true);
  guardando = signal(false);
  errores = signal<string[]>([]);
  exito = signal<string | null>(null);

  ngOnInit() {
    this.productoService.getAll().subscribe({
      next: (data) => {
        this.productos.set(data);
        this.cargandoProductos.set(false);
      },
      error: (err) => {
        this.errores.set(obtenerMensajesError(err, 'No se pudo cargar los productos.'));
        this.cargandoProductos.set(false);
      }
    });
  }

  onSubmit() {
    this.exito.set(null);

    if (!this.movimiento.productoId) {
      this.errores.set(['Selecciona un producto.']);
      return;
    }

    this.errores.set([]);
    this.guardando.set(true);

    const productoId = this.movimiento.productoId;

    this.movimientoService.create(this.movimiento).subscribe({
      next: () => this.confirmarStockActualizado(productoId),
      error: (err) => {
        this.guardando.set(false);
        this.errores.set(obtenerMensajesError(err, 'No se pudo registrar el movimiento.'));
      }
    });
  }

  /**
   * Vuelve a pedir el producto al backend (en vez de calcular el stock en el
   * cliente) para mostrar el valor real guardado y así confirmar que el
   * movimiento sí impactó el inventario, no solo que el POST respondió 201.
   */
  private confirmarStockActualizado(productoId: number) {
    this.productoService.getById(productoId).subscribe({
      next: (producto) => {
        this.actualizarListaProductos(producto);
        this.exito.set(`Movimiento registrado. Stock actual de "${producto.nombre}": ${producto.stock} unidades.`);
        this.guardando.set(false);
        this.movimiento = { productoId: 0, tipo: 'ENTRADA', cantidad: 1 };
      },
      error: () => {
        this.exito.set('Movimiento registrado correctamente.');
        this.guardando.set(false);
        this.movimiento = { productoId: 0, tipo: 'ENTRADA', cantidad: 1 };
      }
    });
  }

  private actualizarListaProductos(producto: Producto) {
    this.productos.update((lista) => lista.map((p) => (p.id === producto.id ? producto : p)));
  }
}
