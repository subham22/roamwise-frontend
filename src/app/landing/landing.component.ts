import { Component, inject, OnInit } from '@angular/core';
import { DropdownComponent } from '../shared/dropdown/dropdown.component';
import { PublicNavComponent } from '../shared/components/public-nav/public-nav.component';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TripDraftService } from '../shared/services/trip-draft.service';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { PlaceAutocompleteComponent } from '../shared/components/place-autocomplete/place-autocomplete.component';

@Component({
  selector: 'app-landing',
  imports: [DropdownComponent, PublicNavComponent, ReactiveFormsModule, PlaceAutocompleteComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit {
    

    private fb = inject(FormBuilder);
    private service = inject(TripDraftService);
    private router = inject(Router);
    private authService = inject(AuthService);

    tripForm!: FormGroup;

    ngOnInit(): void {
        this.tripForm = this.fb.group({
            vibe: new FormControl('Food + culture', [Validators.required]),
            destination: new FormControl('', [Validators.required]),
            duration: new FormControl('3 days', [Validators.required]),
            budget: new FormControl('₹25,000', [Validators.required]),
        })
    }

    buildTrip() {
        if (this.tripForm.valid) {
            this.service.saveDraft(this.tripForm.value);
            if (this.authService.isLoggedIn()) {
                this.router.navigate(['/app/new-trip']);
            } else {
                this.router.navigate(['/signup']);
            }
        }
    }


}
