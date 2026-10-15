import { Component, effect, inject, input } from '@angular/core';
import { GuideDetail } from '../../../models/guide.interface';
import { httpResource } from '@angular/common/http';
import { SeoService } from '../../../services/seo.service';
import { PublicNavComponent } from '../../public-nav/public-nav.component';
import { environment } from '../../../../../environments/environment';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-guide-detail',
  imports: [PublicNavComponent, RouterModule],
  templateUrl: './guide-detail.component.html',
  styleUrl: './guide-detail.component.css',
})
export class GuideDetailComponent {
  slug = input.required<string>();

  apiUrl = environment.apiUrl;

  private seo = inject(SeoService);

  guide = httpResource<GuideDetail>(() => `/guides/${this.slug()}`);

  constructor() {
    effect(() => {
      const guide = this.guide.value();
      if (guide) {
        this.seo.update({
          title: guide.title,
          description: guide.metaDescription,
          path: `/guides/${guide.slug}`,
          image: this.heroImage(guide), // guide photo in link previews
        });
        this.seo.setJsonLd(this.buildJsonLd(guide)); // must come after update()
      }
    });
  }

  // Turns the Google photo reference into a real, public image URL
  private heroImage(g: GuideDetail): string {
    if (!g.heroImageUrl) {
      return `${environment.siteUrl}og-image.jpg`;
    }
    return `${environment.siteUrl}api/places/photo?photoReference=${encodeURIComponent(g.heroImageUrl)}`;
  }

  private buildJsonLd(g: GuideDetail) {
    const pageUrl = `${environment.siteUrl}guides/${g.slug}`;
    const org = {
  '@type': 'Organization',
  '@id': `${environment.siteUrl}#organization`,
  name: 'Roamwise',
  url: `${environment.siteUrl}`,
  logo: `${environment.siteUrl}logo.png`,
};

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          '@id': `${pageUrl}#article`,
          mainEntityOfPage: pageUrl,
          headline: g.title,
          description: g.metaDescription,
          about: { '@type': 'Place', name: g.destination },
          image: this.heroImage(g),
          author: org,
          publisher: org,
          ...(g.createdAt && { datePublished: g.createdAt }),
          ...(g.updatedAt && { dateModified: g.updatedAt }),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${environment.siteUrl}` },
            { '@type': 'ListItem', position: 2, name: 'Guides', item: `${environment.siteUrl}guides` },
            { '@type': 'ListItem', position: 3, name: g.title, item: pageUrl },
          ],
        },
      ],
    };
  }
}