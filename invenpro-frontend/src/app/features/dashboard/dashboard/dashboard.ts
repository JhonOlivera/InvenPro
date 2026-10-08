import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../productos/producto.service';
import { ProveedorService } from '../../proveedores/proveedor.service';
import { MovimientoService } from '../../movimientos/movimiento.service';
import { Producto } from '../../../shared/models/producto.model';
import { Movimiento } from '../../../shared/models/movimiento.model';
import { obtenerMensajesError } from '../../../shared/utils/http-error.util';
import { calcularEstadoStock, ETIQUETA_ESTADO_STOCK, EstadoStock } from '../../../shared/utils/stock.util';
import { PageHeader } from '../../../shared/components/page-header/page-header';

const MOVIMIENTOS_RECIENTES = 5;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, PageHeader],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private productoService = inject(ProductoService);
  private proveedorService = inject(ProveedorService);
  private movimientoService = inject(MovimientoService);

  totalProductos = signal<number | null>(null);
  totalProveedores = signal<number | null>(null);

  stockBajo = signal<Producto[]>([]);
  cargandoStockBajo = signal(true);
  errorStockBajo = signal<string | null>(null);

  movimientosRecientes = signal<Movimiento[]>([]);
  cargandoMovimientos = signal(true);
  errorMovimientos = signal<string | null>(null);

  errorResumen = signal<string | null>(null);

  ngOnInit() {
    this.cargarResumen();
    this.cargarStockBajo();
    this.cargarMovimientosRecientes();
  }

  estadoStock(producto: Producto): EstadoStock {
    return calcularEstadoStock(producto.stock, producto.stockMinimo);
  }

  etiquetaEstadoStock(producto: Producto): string {
    return ETIQUETA_ESTADO_STOCK[this.estadoStock(producto)];
  }

  // No hay endpoint de /api/dashboard: el total de productos y proveedores
  // se calcula aquí a partir de los listados completos ya existentes.
  private cargarResumen() {
    this.productoService.getAll().subscribe({
      next: (productos) => this.totalProductos.set(productos.length),
      error: (err) => this.errorResumen.set(obtenerMensajesError(err, 'No se pudo cargar el total de productos.')[0])
    });

    this.proveedorService.getAll().subscribe({
      next: (proveedores) => this.totalProveedores.set(proveedores.length),
      error: (err) => this.errorResumen.set(obtenerMensajesError(err, 'No se pudo cargar el total de proveedores.')[0])
    });
  }

  private cargarStockBajo() {
    this.cargandoStockBajo.set(true);
    this.productoService.getStockBajo().subscribe({
      next: (productos) => {
        this.stockBajo.set(productos);
        this.cargandoStockBajo.set(false);
      },
      error: (err) => {
        this.errorStockBajo.set(obtenerMensajesError(err, 'No se pudo cargar los productos con stock bajo.')[0]);
        this.cargandoStockBajo.set(false);
      }
    });
  }

  // /api/movimientos no pagina ni ordena: se pide todo y se recorta en el
  // cliente a los más recientes por fecha.
  private cargarMovimientosRecientes() {
    this.cargandoMovimientos.set(true);
    this.movimientoService.getAll().subscribe({
      next: (movimientos) => {
        const recientes = [...movimientos]
          .sort((a, b) => (b.fecha ?? '').localeCompare(a.fecha ?? ''))
          .slice(0, MOVIMIENTOS_RECIENTES);
        this.movimientosRecientes.set(recientes);
        this.cargandoMovimientos.set(false);
      },
      error: (err) => {
        this.errorMovimientos.set(obtenerMensajesError(err, 'No se pudo cargar los movimientos recientes.')[0]);
        this.cargandoMovimientos.set(false);
      }
    });
  }
}
