import { Component, effect, input, signal } from '@angular/core';

/**
 * Imagen con placeholder: si no hay URL, o si la URL falla al cargar,
 * muestra un ícono genérico en vez de un hueco roto. Usado en la
 * miniatura de la tabla de productos y en la vista previa del formulario.
 */
@Component({
  selector: 'app-image-fallback',
  standalone: true,
  imports: [],
  templateUrl: './image-fallback.html',
  styleUrl: './image-fallback.scss'
})
export class ImageFallback {
  src = input<string | null | undefined>(null);
  alt = input<string>('');
  tamano = input<'sm' | 'lg' | 'card'>('sm');

  fallo = signal(false);

  constructor() {
    effect(() => {
      this.src();
      this.fallo.set(false);
    });
  }

  onError() {
    this.fallo.set(true);
  }
}
