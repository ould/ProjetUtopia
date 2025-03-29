import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-confirmation-email',
    templateUrl: './confirmation-email.component.html',
    styleUrls: ['./confirmation-email.component.css'],
    standalone: false
})
export class ConfirmationEmailComponent {
  confirmationEmail: boolean = false;

  ngOnInit(): void {
    const hash = this.route.snapshot.params['id'] || '';
    if (hash) {
      this.confirmEmail(hash);
    }
  }

  confirmEmail(token: string): void {
    this.authService.confirmerEmail(token).subscribe({
      next: (data) => {
        if (data) {
          this.confirmationEmail = true;
        }
      },
      error: (err) => {
        alert('Erreur lors de la confirmation de l\'email. Veuillez contacter le support.');
      }
    });
  }

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private router: Router
  ){}
}
