import { inject } from "@angular/core";
import { AuthenticationService } from "../service/auth.service";
import { Router } from "@angular/router";

export const AuthGuard = () => {

    if (!inject(AuthenticationService).isAuthenticated()) {
      return inject(Router).navigateByUrl("/login");
    }

    return true;
}
