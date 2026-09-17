import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripDraftService } from '../shared/services/trip-draft.service';

@Component({
  selector: 'app-login',
  imports: [
	ReactiveFormsModule,
	CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit{

	loginForm!: FormGroup;
	errorMessage = signal<string>('');
	isLoading = signal<boolean>(false);
	fb = inject(FormBuilder);
	router = inject(Router);

	private service = inject(AuthService);
	private draftService = inject(TripDraftService);

	ngOnInit(): void {
		this.loginForm = this.fb.group({
			email: new FormControl('', [Validators.email, Validators.required]),
			password: new FormControl('', [Validators.required])
		})
	}

	onSubmit() {
		if (this.loginForm.valid) {
			this.isLoading.set(true);
			this.service.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
				next: response => {
					this.errorMessage.set('');
					this.service.setToken(response.token);
					this.isLoading.set(false);
					const draft = this.draftService.getDraft();
					if (draft) {
						this.router.navigate(['/app/new-trip']);
					} else {
						this.router.navigate(['/app/dashboard']);
					}
				}, error: error => {
					this.isLoading.set(false);
					this.errorMessage.set(error.error?.message ?? 'Some Error Occured')
				}
			})
		}
	}
}
