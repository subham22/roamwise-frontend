import { Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GuideSummary } from '../../models/guide.interface';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-guide-card',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './guide-card.component.html',
  styleUrl: './guide-card.component.css',
})
export class GuideCardComponent {
  guide = input.required<GuideSummary>();
  priority = input(false);

  photoUrl(ref: string): string {
    return `${environment.apiUrl}/places/photo?photoReference=${encodeURIComponent(ref)}`;
  }
}