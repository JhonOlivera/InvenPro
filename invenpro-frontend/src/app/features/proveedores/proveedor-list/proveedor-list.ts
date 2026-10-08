import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProveedorService } from '../proveedor.service';
import { Proveedor } from '../../../shared/models/proveedor.model';
import { ConfirmService } from '../../../shared/services/confirm.service';
import { obtenerMensajesError } from '../../../shared/utils/http-error.util';
import { PageHeader } from '../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-proveedor-list',
  standalone: true,
  imports: [RouterLink, FormsModule, PageHeader],
  templateUrl: './proveedor-list.html',
  styleUrl: './proveedor-list.scss'
})
export class ProveedorList implements OnInit {
  private proveedorService = inject(ProveedorService);
  private confirmService = inject(ConfirmService);

  proveedores = signal<Proveedor[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);
  errorEliminar = signal<string | null>(null);
  eliminandoId = signal<number | null>(null);
  busqueda = signal('');

  proveedoresFiltrados = computed(() => {
    const termino = this.busqueda().trim().toLowerCase();
    if (!termino) {
      return this.proveedores();
    }
    return this.proveedores().filter((proveedor) =>
      proveedor.nombre.toLowerCase().includes(termino) ||
      (proveedor.email ?? '').toLowerCase().includes(termino)
    );
  });

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.error.set(null);
    this.proveedorService.getAll().subscribe({
      next: (data) => {
        this.proveedores.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(obtenerMensajesError(err, 'No se pudo cargar los proveedores.')[0]);
        this.cargando.set(false);
      }
    });
  }

  async eliminar(proveedor: Proveedor) {
    const confirmado = await this.confirmService.confirm({
      titulo: 'Eliminar proveedor',
      mensaje: `¿Seguro que quieres eliminar "${proveedor.nombre}"? Esta acción no se puede deshacer.`,
      textoConfirmar: 'Eliminar',
      peligro: true
    });
    if (!confirmado) {
      return;
    }

    this.errorEliminar.set(null);
    this.eliminandoId.set(proveedor.id!);
    this.proveedorService.delete(proveedor.id!).subscribe({
      next: () => {
        this.proveedores.update((lista) => lista.filter((p) => p.id !== proveedor.id));
        this.eliminandoId.set(null);
      },
      error: (err) => {
        this.errorEliminar.set(obtenerMensajesError(err, 'No se pudo eliminar el proveedor.')[0]);
        this.eliminandoId.set(null);
      }
    });
  }
}
