import {inject} from '@angular/core';
import { Router } from '@angular/router';

import { SessionService } from './session.service';

export const authGuard = () => {
  const sessionService = inject(SessionService);
  const router = inject(Router);
  
  if (sessionService.isLoggedIn()) {
    return true;
  }
  var baseUrl = window.location.href.split('/')[3];
  // Redirect to the login page
  return router.parseUrl('/login?originUrl='+baseUrl);

  
};