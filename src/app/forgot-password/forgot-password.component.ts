import { Component, inject, OnInit, signal } from '@angular/core';
import { PublicNavComponent } from '../shared/components/public-nav/public-nav.component';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-forgot-password',
    imports: [PublicNavComponent, ReactiveFormsModule, RouterModule],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent implements OnInit {
    forgotForm!: FormGroup;
    submitted = signal<boolean>(false);
    isLoading = signal<boolean>(false);

    private service = inject(AuthService);

    ngOnInit(): void {
        this.forgotForm = new FormGroup({
            email: new FormControl('', [Validators.email]),
        });
    }

    onSubmit() {
        if (this.forgotForm.valid) {
            this.isLoading.set(true);
           
            this.service.forgotPassword(this.forgotForm.value.email).subscribe({
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
