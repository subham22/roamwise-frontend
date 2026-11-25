import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-footer',
  imports: [RouterModule],
  template: `
    <footer class="site-footer">
      <p class="support">
        Did Roamwise help you plan your trip?
        <a href="https://github.com/sponsors/subham22" target="_blank" rel="noopener">☕ Buy me a coffee</a>
      </p>
      <p>
        © {{ year }} Roamwise · <a routerLink="/guides">India travel guides</a> · Built by
        <a href="https://github.com/subham22" target="_blank" rel="noopener author">Subham Kumar</a>
        (<a href="https://github.com/subham22" target="_blank" rel="noopener">GitHub</a>)
      </p>
    </footer>
  `,
  styles: `
    .site-footer { border-top: 1px solid var(--color-line); margin-top: 64px; padding: 24px 16px; text-align: center; }
    p { color: var(--color-muted); font-size: 14px; margin: 0; }
    a { color: var(--color-primary-text); }
    .support { color: var(--color-text); font-size: 15px; margin-bottom: 10px; }
    .support a { font-weight: 700; }
  `,
})
export class PublicFooterComponent {
  year = new Date().getFullYear();
}
