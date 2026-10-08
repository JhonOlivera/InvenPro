import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovimientoService } from '../movimiento.service';
import { Movimiento } from '../../../shared/models/movimiento.model';
import { obtenerMensajesError } from '../../../shared/utils/http-error.util';

@Component({
  selector: 'app-movimiento-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './movimiento-list.html',
  styleUrl: './movimiento-list.scss'
})
export class MovimientoList implements OnInit {
  private movimientoService = inject(MovimientoService);

  movimientos = signal<Movimiento[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.error.set(null);
    this.movimientoService.getAll().subscribe({
      next: (data) => {
        const ordenados = [...data].sort((a, b) => (b.fecha ?? '').localeCompare(a.fecha ?? ''));
        this.movimientos.set(ordenados);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(obtenerMensajesError(err, 'No se pudo cargar los movimientos.')[0]);
        this.cargando.set(false);
      }
    });
  }
}
