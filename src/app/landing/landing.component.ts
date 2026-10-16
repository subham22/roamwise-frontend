import { Component, computed, inject, OnInit } from '@angular/core';
import { DropdownComponent } from '../shared/dropdown/dropdown.component';
import { PublicNavComponent } from '../shared/components/public-nav/public-nav.component';
import {
    FormGroup,
    FormControl,
    Validators,
    FormBuilder,
    ReactiveFormsModule,
} from '@angular/forms';
import { TripDraftService } from '../shared/services/trip-draft.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { PlaceAutocompleteComponent } from '../shared/components/place-autocomplete/place-autocomplete.component';
import { SeoService } from '../shared/services/seo.service';
import { httpResource } from '@angular/common/http';
import { GuideSummary } from '../shared/models/guide.interface';
import { GuideCardComponent } from '../shared/components/guide-card/guide-card.component';

@Component({
    selector: 'app-landing',
    imports: [
    DropdownComponent,
    PublicNavComponent,
    ReactiveFormsModule,
    PlaceAutocompleteComponent,
    GuideCardComponent,
    RouterModule
],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit {
    private fb = inject(FormBuilder);
    private service = inject(TripDraftService);
    private router = inject(Router);
    private authService = inject(AuthService);
    private seoService = inject(SeoService);

    tripForm!: FormGroup;

    private readonly featuredSlugs = [
        'goa-india-3-days', // most-searched lengths from keyword research
        'jaipur-india-2-days',
        'udaipur-india-3-days',
        'manali-india-4-days',
        'rishikesh-india-4-days',
        'munnar-india-3-days',
    ];

    guides = httpResource<GuideSummary[]>(() => '/guides');

    featuredGuides = computed(() => {
        const all = this.guides.value() ?? [];
        const picked = this.featuredSlugs
            .map((slug) => all.find((g) => g.slug === slug))
            .filter((g): g is GuideSummary => !!g);
        // Not all featured guides published yet? Fill up to 6 with others.
        const rest = all.filter((g) => !picked.includes(g));
        return [...picked, ...rest].slice(0, 6);
    });

    ngOnInit(): void {
        this.tripForm = this.fb.group({
            vibe: new FormControl('Food + culture', [Validators.required]),
            destination: new FormControl('', [Validators.required]),
            duration: new FormControl('3 days', [Validators.required]),
            budget: new FormControl('₹25,000', [Validators.required]),
        });

        this.seoService.update({
            title: 'AI Trip Planner for India',
            description:
                'Plan an India trip in minutes with Roamwise, the AI trip planner and itinerary planner built on real places, live weather, travel times and INR budgets.',
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
                    description:
                        'AI trip planner that builds editable itineraries from real places, weather and travel times.',
                    inLanguage: 'en-IN',
                    publisher: { '@id': 'https://roamwise.live/#organization' },
                },
                {
                    '@type': 'Organization',
                    '@id': 'https://roamwise.live/#organization',
                    name: 'Roamwise',
                    url: 'https://roamwise.live/',
                    logo: 'https://roamwise.live/logo.png',
                },
            ],
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
