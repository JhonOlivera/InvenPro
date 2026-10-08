import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from '../models/error-response.model';

/**
 * Convierte un error HTTP en la lista de mensajes a mostrar al usuario.
 * El backend responde con ErrorResponseDto: usa `detalles` (errores de
 * validación por campo) cuando existen, o `mensaje` en caso contrario.
 */
export function obtenerMensajesError(
  error: unknown,
  mensajePorDefecto = 'Ocurrió un error inesperado. Intenta de nuevo.'
): string[] {
  if (error instanceof HttpErrorResponse) {
    const cuerpo = error.error as ErrorResponse | undefined;
    if (cuerpo?.detalles?.length) {
      return cuerpo.detalles;
    }
    if (cuerpo?.mensaje) {
      return [cuerpo.mensaje];
    }
    if (error.status === 0) {
      return ['No se pudo conectar con el backend. ¿Está corriendo en el puerto 8080?'];
    }
  }
  return [mensajePorDefecto];
}
