import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

/**
 * UsuarioController exige ROLE_ADMIN en todos sus endpoints (ver
 * @PreAuthorize("hasRole('ADMIN')") en el backend). Este guard replica esa
 * regla en el cliente para que un EMPLEADO ni siquiera llegue a /usuarios;
 * el backend sigue siendo quien realmente lo impide si alguien se lo salta.
 */
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUser()?.rol === 'ADMIN') {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
