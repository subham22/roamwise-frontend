import { Component, inject, input, OnInit, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TripService } from '../shared/services/trip.service';
import { interval, switchMap, takeWhile } from 'rxjs';
import { JobService } from '../shared/services/job.service';
import { Router } from '@angular/router';
import { PlaceAutocompleteComponent } from '../shared/components/place-autocomplete/place-autocomplete.component';
import { SeoService } from '../shared/services/seo.service';

@Component({
  selector: 'app-generate-trip',
  imports: [ReactiveFormsModule, PlaceAutocompleteComponent],
  templateUrl: './generate-trip.component.html',
  styleUrl: './generate-trip.component.css',
})
export class GenerateTripComponent implements OnInit {

    tripForm!: FormGroup;
    isGenerating = signal<boolean>(false);
    jobStatus = signal<string | null>(null)
    progress = signal<string | null>(null);

    // Must match the step messages ItineraryGenerationService reports
    readonly steps = ['Finding the best places', 'Checking the weather', 'Planning your days', 'Saving your trip'];
    currentStep = computed(() => {
        const message = this.progress();
        if (!message) return -1;
        if (message.startsWith('Double-checking')) return 2; // retry happens during the AI step
        return this.steps.findIndex((step) => message.startsWith(step));
    });
    errorMessage = signal<string>('')
    today = new Date().toISOString().split('T')[0];
    
    destination = input<string>()
    
    private tripService = inject(TripService);
    private jobService = inject(JobService);
    private router = inject(Router);
    private seo  = inject(SeoService);


    ngOnInit(): void {
        this.tripForm = new FormGroup({
          origin: new FormControl('', Validators.required),
          destination: new FormControl(this.destination() ?? '', Validators.required),
          startDate: new FormControl(''),
          endDate: new FormControl(''),
          budget: new FormControl(''),
          interest: new FormControl('', Validators.required),
        });

         this.seo.update({
            title: 'Generate a New Trip',
            description: 'Generate a New Trip',
            path: '/app/generate-trip',
            noindex: true,
        })
    }

    onSubmit() {
        if (this.tripForm.valid) {
            this.isGenerating.set(true);
            this.tripService.generateTrip(this.tripForm.value).subscribe({
                next: response => {
                   this.startPolling(response);
                },  error: (err) => {
                    this.isGenerating.set(false);
                    this.errorMessage.set(err.error?.message ?? 'Failed to start generation');
                }
            })
        }
    }

    private startPolling(jobId: number) {
        interval(3000)
            .pipe(
                switchMap(() => this.jobService.getJobStatus(jobId)),
                takeWhile((res) => res.status !== 'DONE' && res.status !== 'FAILED', true)
            )
            .subscribe({
                next: (res) => {
                    this.jobStatus.set(res.status);
                    this.progress.set(res.progress ?? null);

                    if (res.status === 'DONE' && res.resultTripId) {
                        this.isGenerating.set(false);
                        this.router.navigate(['/app/trips', res.resultTripId]);
                    } else if (res.status === 'FAILED') {
                        this.isGenerating.set(false);
                        this.errorMessage.set(res.errorMessage ?? 'Generation failed');
                    }
                }
            });
    }
}
