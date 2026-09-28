import { Component, inject, OnInit } from '@angular/core';
import { DropdownComponent } from '../shared/dropdown/dropdown.component';
import { PublicNavComponent } from '../shared/components/public-nav/public-nav.component';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TripDraftService } from '../shared/services/trip-draft.service';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { PlaceAutocompleteComponent } from '../shared/components/place-autocomplete/place-autocomplete.component';
import { SeoService } from '../shared/services/seo.service';

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
    private seoService = inject(SeoService);

    tripForm!: FormGroup;

    ngOnInit(): void {
        this.tripForm = this.fb.group({
            vibe: new FormControl('Food + culture', [Validators.required]),
            destination: new FormControl('', [Validators.required]),
            duration: new FormControl('3 days', [Validators.required]),
            budget: new FormControl('₹25,000', [Validators.required]),
        })

        this.seoService.update({
            title: 'AI Trip Planner for India',
            description: 'Plan a real, editable trip in minutes. Roamwise builds itineraries from real places, live weather, travel times and budgets, then lets you change anything.',
            path: '/',
            image: '/og-image.jpg',
        });

        this.seoService.setJsonLd({
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type': 'WebSite',
                    '@id': 'https://roamwise.live/#website',
                    url: 'https://roamwise.live/',
                    name: 'Roamwise',
                    logo: 'https://roamwise.live/logo.png',
                    description: 'AI trip planner that builds editable itineraries from real places, weather and travel times.',
                    inLanguage: 'en-IN',
                    publisher: { '@id': 'https://roamwise.live/#organization' }
                },
                {
                    '@type': 'Organization',
                    '@id': 'https://roamwise.live/#organization',
                    name: 'Roamwise',
                    url: 'https://roamwise.live/',
                    logo: 'https://roamwise.live/logo.png',
                }
            ]
        });
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
