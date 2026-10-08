import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/shell/service/auth.service';
import { obtenerMensajesError } from '../../../shared/utils/http-error.util';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = signal<string | null>(null);
  cargando = signal(false);

  onSubmit() {
    this.error.set(null);
    this.cargando.set(true);
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set(obtenerMensajesError(err, 'Correo o contraseña incorrectos.')[0]);
      }
    });
  }
}