import { Rol } from './rol.model';

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  /** Write-only: el backend nunca la devuelve. Vacía en edición = no cambiarla. */
  password?: string;
  rol: Rol;
}
