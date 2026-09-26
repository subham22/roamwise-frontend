import { isPlatformBrowser } from "@angular/common";
import { HttpClient, httpResource } from "@angular/common/http";
import { computed, inject, Injectable, PLATFORM_ID, signal } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = '/auth';
    private http = inject(HttpClient);
    private platformId = inject(PLATFORM_ID);

    token = signal<string | null>(this.getToken());

    getToken(): string | null {
        if (!isPlatformBrowser(this.platformId)) {
            return null;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            return null;
        }

        const decodedToken = this.decodeToken(token);
        const expTime = decodedToken?.exp;

        if (!expTime) {
            return token;
        }

        return Date.now() < expTime * 1000 ? token : null;
    }

    userEmail = computed(() => this.token() ? this.extractEmail() : null);

    forgotPassword(email: string): Observable<void> {
        return this.http.post<void>('/auth/forgot-password', { email });
    }

    resetPassword(token: string, newPassword: string): Observable<void> {
        return this.http.post<void>('/auth/reset-password', { token, newPassword });
    }

    private decodeToken(token: string | null): { exp?: number; sub?: string } | null {
        if (!token) {
            return null;
        }

        try {
            const payload = token.split('.')[1];
            if (!payload) {
                return null;
            }

            const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
            const paddedPayload = normalizedPayload.padEnd(
                Math.ceil(normalizedPayload.length / 4) * 4,
                '='
            );

            const decoded = atob(paddedPayload);
            return JSON.parse(decoded);
        } catch {
            return null;
        }
    }

    extractEmail(): string {
        return this.decodeToken(this.token())?.sub ?? '';
    }

    isLoggedIn = computed(() => !!this.token());

    login(email: string, password: string): Observable<any> {
        return this.http.post(this.apiUrl + '/login', {
            email: email,
            password: password
        })
    }

    setToken(token: string): void {
        localStorage.setItem('token', token);
        this.token.set(token);
    }

    logout(): void {
        localStorage.removeItem('token');
        sessionStorage.removeItem('tripDraft')
        this.token.set(null);
    }

    signup(email: string, password: string): Observable<any> {
        return this.http.post(this.apiUrl + '/signup', {
            email: email,
            password: password
        })
    }
}