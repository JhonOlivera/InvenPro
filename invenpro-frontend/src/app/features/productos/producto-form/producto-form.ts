import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProductoService } from '../producto.service';
import { CategoriaService } from '../../categorias/categoria.service';
import { ProveedorService } from '../../proveedores/proveedor.service';
import { Producto } from '../../../shared/models/producto.model';
import { Categoria } from '../../../shared/models/categoria.model';
import { Proveedor } from '../../../shared/models/proveedor.model';
import { obtenerMensajesError } from '../../../shared/utils/http-error.util';
import { ImageFallback } from '../../../shared/components/image-fallback/image-fallback';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [FormsModule, RouterLink, ImageFallback],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.scss'
})
export class ProductoForm implements OnInit {
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private proveedorService = inject(ProveedorService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private id: number | null = null;
  modoEdicion = false;

  producto: Producto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    stockMinimo: 0,
    categoriaId: 0,
    proveedorId: 0,
    codigo: '',
    imagenUrl: ''
  };

  categorias = signal<Categoria[]>([]);
  proveedores = signal<Proveedor[]>([]);

  cargando = signal(true);
  guardando = signal(false);
  errores = signal<string[]>([]);

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.modoEdicion = idParam !== null;
    if (idParam) {
      this.id = Number(idParam);
    }

    forkJoin({
      categorias: this.categoriaService.getAll(),
      proveedores: this.proveedorService.getAll()
    }).subscribe({
      next: ({ categorias, proveedores }) => {
        this.categorias.set(categorias);
        this.proveedores.set(proveedores);

        if (this.id === null) {
          this.cargando.set(false);
          return;
        }

        this.productoService.getById(this.id).subscribe({
          next: (data) => {
            this.producto = data;
            this.cargando.set(false);
          },
          error: (err) => {
            this.errores.set(obtenerMensajesError(err, 'No se pudo cargar el producto.'));
            this.cargando.set(false);
          }
        });
      },
      error: (err) => {
        this.errores.set(obtenerMensajesError(err, 'No se pudo cargar categorías y proveedores.'));
        this.cargando.set(false);
      }
    });
  }

  onSubmit() {
    const erroresCliente: string[] = [];
    if (!this.producto.categoriaId) {
      erroresCliente.push('Selecciona una categoría.');
    }
    if (!this.producto.proveedorId) {
      erroresCliente.push('Selecciona un proveedor.');
    }
    if (erroresCliente.length > 0) {
      this.errores.set(erroresCliente);
      return;
    }

    this.errores.set([]);
    this.guardando.set(true);

    const peticion = this.modoEdicion && this.id !== null
      ? this.productoService.update(this.id, this.producto)
      : this.productoService.create(this.producto);

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.router.navigate(['/productos']);
      },
      error: (err) => {
        this.guardando.set(false);
        this.errores.set(obtenerMensajesError(err, 'No se pudo guardar el producto.'));
      }
    });
  }
}
