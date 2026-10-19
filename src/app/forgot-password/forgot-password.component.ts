import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { PublicNavComponent } from '../shared/components/public-nav/public-nav.component';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { RouterModule } from '@angular/router';
import { SeoService } from '../shared/services/seo.service';
import { TurnstileComponent } from '../shared/components/turnstile/turnstile.component';

@Component({
    selector: 'app-forgot-password',
    imports: [PublicNavComponent, ReactiveFormsModule, RouterModule, TurnstileComponent],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent implements OnInit {
    forgotForm!: FormGroup;
    submitted = signal<boolean>(false);
    isLoading = signal<boolean>(false);

    private service = inject(AuthService);
    private seo = inject(SeoService);

    captchaToken = signal<string | null>(null);
    captcha = viewChild.required<TurnstileComponent>('captcha');


    ngOnInit(): void {
        this.forgotForm = new FormGroup({
            email: new FormControl('', [Validators.email]),
        });

        this.seo.update({
            title: 'Forgot password',
            description: 'Reset your Roamwise password. Enter your email and we will send you a reset link.',
            path: '/forgot-password',
            noindex: true,
        });
    }

    onSubmit() {
        if (this.forgotForm.valid) {
            this.isLoading.set(true);
           
            this.service.forgotPassword(this.forgotForm.value.email, this.captchaToken()!).subscribe({
                next: (response) => {
                    this.isLoading.set(false);
                     this.submitted.set(true);
                }, error: error => {
                    this.isLoading.set(false);
                    this.submitted.set(false);
                }
            });
        }
    }
}
