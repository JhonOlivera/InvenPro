import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss'
})
export class PageHeader {
  eyebrow = input<string>('');
  titulo = input.required<string>();
  descripcion = input<string>('');
}
