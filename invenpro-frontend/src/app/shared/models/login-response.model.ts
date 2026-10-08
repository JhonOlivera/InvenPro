import { Rol } from './rol.model';

export interface LoginResponse {
  nombre: string;
  email: string;
  rol: Rol;
}
