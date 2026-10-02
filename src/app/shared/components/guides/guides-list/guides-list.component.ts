import { Component } from '@angular/core';
import { PublicNavComponent } from '../../public-nav/public-nav.component';
import { GuideSummary } from '../../../models/guide.interface';
import { httpResource } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-guides-list',
  imports: [PublicNavComponent, RouterModule],
  templateUrl: './guides-list.component.html',
  styleUrl: './guides-list.component.css',
})
export class GuidesListComponent {

    apiUrl = environment.apiUrl;
    guides = httpResource<GuideSummary[]>(() => `/guides`);
}
