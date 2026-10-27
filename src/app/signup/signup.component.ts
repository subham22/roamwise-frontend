import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { AnalyticsService } from '../shared/services/analytics.service';
import { Router, RouterModule } from '@angular/router';
import { PublicNavComponent } from '../shared/components/public-nav/public-nav.component';
import { ValidationError } from '@angular/forms/signals';
import { AuthService } from '../shared/services/auth.service';
import { SeoService } from '../shared/services/seo.service';
import { TurnstileComponent } from '../shared/components/turnstile/turnstile.component';

@Component({
    selector: 'app-signup',
    imports: [ReactiveFormsModule, RouterModule, PublicNavComponent, TurnstileComponent],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
    signupForm!: FormGroup;

    errorMessage = signal<string>('');
    isLoading = signal<boolean>(false);

    private authService = inject(AuthService);
    private router = inject(Router);
    private analytics = inject(AnalyticsService);
    private fb = inject(FormBuilder);
    private seo = inject(SeoService);

    captchaToken = signal<string | null>(null);
    captcha = viewChild.required<TurnstileComponent>('captcha');


    ngOnInit(): void {
        this.seo.update({
			title: 'Sign up',
			description: 'Signup to Roamwise to plan and manage your trips.',
			path: '/signup',
			noindex: true,
		});
        this.signupForm = this.fb.group(
            {
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required, Validators.minLength(8)]],
                confirmPassword: ['', Validators.required],
            },
            { validators: this.passwordMatchValidator },
        );
    }

    passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { passwordMismatch: true };
    }

    onSubmit() {
        if (this.signupForm.valid) {
            this.isLoading.set(true);
            this.authService
                .signup(
                    this.signupForm.value.email,
                    this.signupForm.value.password,
                    this.captchaToken()!
                )
                .subscribe({
                    next: response => {
                        this.isLoading.set(false);
                        this.analytics.event('sign_up', { method: 'email' });
                        this.router.navigate(["/login"])
                    }, error: error => {
                        this.isLoading.set(false);
                        this.captcha().reset()
                        this.errorMessage.set(error.error.message ?? 'Some Error Occured')
                    }
                });
        }
    }
}
