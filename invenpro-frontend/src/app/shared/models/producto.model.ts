export interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  categoriaId: number;
  categoriaNombre?: string;
  proveedorId: number;
  proveedorNombre?: string;
  codigo?: string;
  imagenUrl?: string;
}