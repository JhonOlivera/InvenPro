import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProveedorService } from '../proveedor.service';
import { Proveedor } from '../../../shared/models/proveedor.model';
import { obtenerMensajesError } from '../../../shared/utils/http-error.util';

@Component({
  selector: 'app-proveedor-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './proveedor-form.html',
  styleUrl: './proveedor-form.scss'
})
export class ProveedorForm implements OnInit {
  private proveedorService = inject(ProveedorService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private id: number | null = null;
  modoEdicion = false;

  proveedor: Proveedor = { nombre: '', telefono: '', email: '' };

  cargando = signal(false);
  guardando = signal(false);
  errores = signal<string[]>([]);

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.modoEdicion = true;
      this.id = Number(idParam);
      this.cargando.set(true);
      this.proveedorService.getById(this.id).subscribe({
        next: (data) => {
          this.proveedor = data;
          this.cargando.set(false);
        },
        error: (err) => {
          this.errores.set(obtenerMensajesError(err, 'No se pudo cargar el proveedor.'));
          this.cargando.set(false);
        }
      });
    }
  }

  onSubmit() {
    this.errores.set([]);
    this.guardando.set(true);

    const peticion = this.modoEdicion && this.id !== null
      ? this.proveedorService.update(this.id, this.proveedor)
      : this.proveedorService.create(this.proveedor);

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.router.navigate(['/proveedores']);
      },
      error: (err) => {
        this.guardando.set(false);
        this.errores.set(obtenerMensajesError(err, 'No se pudo guardar el proveedor.'));
      }
    });
  }
}
