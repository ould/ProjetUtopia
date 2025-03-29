import {inject} from '@angular/core';
import { Router } from '@angular/router';

import { SessionService } from '../auth/session.service';

export const adminGuard = () => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  if (sessionService.isLoggedIn()) {
    
    return true;
  }

  // Redirect to the login page
  return router.parseUrl('/login');
};