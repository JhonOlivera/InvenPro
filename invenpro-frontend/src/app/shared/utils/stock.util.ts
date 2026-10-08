export type EstadoStock = 'normal' | 'bajo' | 'agotado';

/**
 * Agotado: sin unidades. Bajo: por debajo o igual al mínimo configurado.
 * Normal: el resto. Usado por la tabla de productos y, más adelante, el dashboard.
 */
export function calcularEstadoStock(stock: number, stockMinimo: number): EstadoStock {
  if (stock <= 0) {
    return 'agotado';
  }
  if (stock <= stockMinimo) {
    return 'bajo';
  }
  return 'normal';
}

export const ETIQUETA_ESTADO_STOCK: Record<EstadoStock, string> = {
  normal: 'Normal',
  bajo: 'Stock bajo',
  agotado: 'Agotado'
};
