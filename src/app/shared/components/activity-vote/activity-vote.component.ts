import { Component, input, output } from '@angular/core';
import { VoteSummary } from '../../models/trip.interface';

/** Thumbs up / down for one activity on a group trip. Clicking your current vote clears it. */
@Component({
    selector: 'app-activity-vote',
    template: `
        <div class="votes" role="group" [attr.aria-label]="'Votes for ' + name()">
            <button type="button" [class.on]="summary()?.mine === 1" [attr.aria-pressed]="summary()?.mine === 1"
                    (click)="vote.emit(summary()?.mine === 1 ? 0 : 1)" aria-label="Thumbs up">
                👍 {{ summary()?.up ?? 0 }}
            </button>
            <button type="button" [class.on]="summary()?.mine === -1" [attr.aria-pressed]="summary()?.mine === -1"
                    (click)="vote.emit(summary()?.mine === -1 ? 0 : -1)" aria-label="Thumbs down">
                👎 {{ summary()?.down ?? 0 }}
            </button>
        </div>
    `,
    styles: `
        .votes { display: inline-flex; gap: 6px; margin-top: 6px; }
        button { border: 1px solid #d9d4cc; background: transparent; border-radius: 999px; padding: 2px 10px; font: inherit; font-size: 13px; cursor: pointer; }
        button.on { background: var(--color-text); border-color: var(--color-text); color: var(--color-surface); }
    `,
})
export class ActivityVoteComponent {
    name = input('');
    summary = input<VoteSummary | undefined>();
    vote = output<-1 | 0 | 1>();
}
