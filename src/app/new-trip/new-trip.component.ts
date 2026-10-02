import { Component, inject, OnInit, signal } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { TripService } from '../shared/services/trip.service';
import { Router } from '@angular/router';
import { TripDraftService } from '../shared/services/trip-draft.service';
import { PlaceAutocompleteComponent } from '../shared/components/place-autocomplete/place-autocomplete.component';
import { SeoService } from '../shared/services/seo.service';

@Component({
    selector: 'app-new-trip',
    imports: [ReactiveFormsModule, PlaceAutocompleteComponent],
    templateUrl: './new-trip.component.html',
    styleUrl: './new-trip.component.css',
})
export class NewTripComponent implements OnInit {
    isLoading = signal<boolean>(false);
    errorMessage = signal<string>('');
    today = new Date().toISOString().split('T')[0];

    private fb = inject(FormBuilder);
    private tripService = inject(TripService);
    private router = inject(Router);
    private draftService = inject(TripDraftService);
    private seo = inject(SeoService);

    tripForm!: FormGroup;

    ngOnInit(): void {
        this.seo.update({
            title: 'New Trip',
            description: 'New Trip',
            path: '/app/new-trip',
            noindex: true,
        })
        this.tripForm = this.fb.group({
            origin: new FormControl('', [Validators.required]),
            destination: new FormControl('', [Validators.required]),
            startDate: new FormControl('', [Validators.required]),
            endDate: new FormControl('', [Validators.required]),
            budget: new FormControl('', [Validators.required]),
        });

        const draft = this.draftService.getDraft();
        if (draft) {
            this.tripForm.patchValue({
                destination: draft.destination,
                budget: this.parseBudget(draft.budget),
            });
            this.draftService.clearDraft();

            const days = Number(draft.duration.replace(/[^0-9]/g, ''));
            this.tripForm
                .get('startDate')
                ?.valueChanges.subscribe((startDateValue) => {
                    if (startDateValue) {
                        const start = new Date(startDateValue);
                        start.setDate(start.getDate() + (days - 1));
                        this.tripForm.patchValue(
                            { endDate: start.toISOString().split('T')[0] },
                            { emitEvent: false }, // avoid retriggering this same subscription
                        );
                    }
                });
        }
    }

    private parseBudget(budget: string): number {
        return Number(budget.replace(/[^\d]/g, ''));
    }

    onSubmit() {
        if (this.tripForm.valid) {
            this.isLoading.set(true);
            this.tripService.createTrip(this.tripForm.value).subscribe({
                next: (response) => {
                    this.isLoading.set(false);
                    this.router.navigate(['/app/dashboard']);
                },
                error: (error) => {
                    this.errorMessage.set(
                        error?.error.message ?? 'Some Error Occurred',
                    );
                },
            });
        }
    }
}
