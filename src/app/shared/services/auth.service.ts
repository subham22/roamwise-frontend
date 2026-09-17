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

    token = signal<string | null>(isPlatformBrowser(this.platformId) ? localStorage.getItem('token'): null);

    userEmail = signal<string | null>(
        this.token() ? this.extractEmail() : null
    )

    extractEmail(): string {
        const payload = this.token()?.split('.')[1];
        if (!payload) {
            return '';
        }
        const decode = atob(payload);
        return JSON.parse(decode);

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