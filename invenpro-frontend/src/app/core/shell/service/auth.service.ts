import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private credentials = signal<string | null>(sessionStorage.getItem('basicAuth'));

  get authHeader(): string | null {
    return this.credentials();
  }

  isAuthenticated(): boolean {
    return this.credentials() !== null;
  }

  setCredentials(email: string, password: string) {
    const encoded = btoa(`${email}:${password}`);
    const header = `Basic ${encoded}`;
    sessionStorage.setItem('basicAuth', header);
    this.credentials.set(header);
  }

  logout() {
    sessionStorage.removeItem('basicAuth');
    this.credentials.set(null);
  }
}