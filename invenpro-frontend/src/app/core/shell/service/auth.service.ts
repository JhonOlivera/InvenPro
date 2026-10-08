import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginResponse } from '../../../shared/models/login-response.model';

const AUTH_HEADER_KEY = 'basicAuth';
const USER_KEY = 'currentUser';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private credentials = signal<string | null>(sessionStorage.getItem(AUTH_HEADER_KEY));
  private user = signal<LoginResponse | null>(leerUsuarioGuardado());

  readonly currentUser = this.user.asReadonly();

  get authHeader(): string | null {
    return this.credentials();
  }

  isAuthenticated(): boolean {
    return this.credentials() !== null;
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const encoded = btoa(`${email}:${password}`);
    const header = `Basic ${encoded}`;

    return this.http.get<LoginResponse>(`${environment.apiUrl}/auth/me`, {
      headers: { Authorization: header }
    }).pipe(
      tap((usuario) => {
        sessionStorage.setItem(AUTH_HEADER_KEY, header);
        sessionStorage.setItem(USER_KEY, JSON.stringify(usuario));
        this.credentials.set(header);
        this.user.set(usuario);
      })
    );
  }

  logout() {
    sessionStorage.removeItem(AUTH_HEADER_KEY);
    sessionStorage.removeItem(USER_KEY);
    this.credentials.set(null);
    this.user.set(null);
  }
}

function leerUsuarioGuardado(): LoginResponse | null {
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as LoginResponse;
  } catch {
    return null;
  }
}
