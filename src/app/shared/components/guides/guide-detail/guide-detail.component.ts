import { Component, effect, inject, input } from '@angular/core';
import { GuideDetail } from '../../../models/guide.interface';
import { httpResource } from '@angular/common/http';
import { SeoService } from '../../../services/seo.service';
import { PublicNavComponent } from '../../public-nav/public-nav.component';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-guide-detail',
  imports: [PublicNavComponent],
  templateUrl: './guide-detail.component.html',
  styleUrl: './guide-detail.component.css',
})
export class GuideDetailComponent {

    slug = input.required<string>();
    apiUrl = environment.apiUrl;

    private seo = inject(SeoService);

    constructor() {
        effect(() => {
            const guide = this.guide.value();
            if (guide) {
                this.seo.update({ title: guide.title, description: guide.metaDescription, path: `/guides/${guide.slug}` });
                this.seo.setJsonLd(this.buildJsonLd(guide));
            }
        })
    }

    guide = httpResource<GuideDetail>(() => `/guides/${this.slug()}`);

    buildJsonLd(g: GuideDetail) {
        return {
            '@context': 'https://schema.org',
            '@graph': [
                {
                '@type': 'Article',
                headline: g.title,
                description: g.metaDescription,
                about: g.destination
                },
                {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: environment.siteUrl + '/' },
                    { '@type': 'ListItem', position: 2, name: 'Guides', item: environment.siteUrl + '/guides' },
                    { '@type': 'ListItem', position: 3, name: g.title, item: environment.siteUrl + '/guides/' + g.slug }
                ]
                }
            ]
        }
    }


}
