import { Injectable, signal } from '@angular/core';

export interface ConfirmOptions {
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  peligro?: boolean;
}

interface ConfirmState extends Required<ConfirmOptions> {
  resolve: (confirmado: boolean) => void;
}

/**
 * Reemplazo de window.confirm() basado en signals: cualquier componente
 * puede pedir confirmación con `confirm(...)` y esperar el resultado,
 * mientras el diálogo visual (ConfirmDialog) se monta una sola vez en
 * app.html y reacciona al estado de este servicio.
 */
@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private state = signal<ConfirmState | null>(null);
  readonly dialogo = this.state.asReadonly();

  confirm(opciones: ConfirmOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.state.set({
        textoConfirmar: 'Confirmar',
        textoCancelar: 'Cancelar',
        peligro: false,
        ...opciones,
        resolve
      });
    });
  }

  resolver(confirmado: boolean): void {
    this.state()?.resolve(confirmado);
    this.state.set(null);
  }
}
