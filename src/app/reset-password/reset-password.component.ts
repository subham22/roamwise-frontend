import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { PublicNavComponent } from '../shared/components/public-nav/public-nav.component';
import { SeoService } from '../shared/services/seo.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, PublicNavComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');
  success = signal(false);

  private token: string | null = null;
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private seo = inject(SeoService)

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
     this.seo.update({
        title: 'Set a new password',
        description: 'Choose a new password for your Roamwise account.',
        path: '/reset-password',
        noindex: true,
      });
    this.resetForm = this.fb.group({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const pass = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.token) return;

    this.isLoading.set(true);
    this.authService.resetPassword(this.token, this.resetForm.value.newPassword).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.success.set(true);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message ?? 'This link is invalid or has expired.');
      }
    });
  }
}