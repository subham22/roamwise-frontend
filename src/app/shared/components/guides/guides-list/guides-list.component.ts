import { Component, inject } from '@angular/core';
import { PublicNavComponent } from '../../public-nav/public-nav.component';
import { GuideSummary } from '../../../models/guide.interface';
import { httpResource } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-guides-list',
  imports: [PublicNavComponent, RouterModule],
  templateUrl: './guides-list.component.html',
  styleUrl: './guides-list.component.css',
})
export class GuidesListComponent {

    apiUrl = environment.apiUrl;
    guides = httpResource<GuideSummary[]>(() => `/guides`);

    private seo = inject(SeoService).update({
      	title: 'Guides',
        description: 'India trip guides, built for real travel',
        path: '/guides',
        noindex: true,
    })
}
