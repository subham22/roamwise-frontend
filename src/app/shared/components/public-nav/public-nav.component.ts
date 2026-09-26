import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-public-nav',
  imports: [RouterModule],
  templateUrl: './public-nav.component.html',
  styleUrl: './public-nav.component.css',
})
export class PublicNavComponent {
  authService = inject(AuthService);
}
