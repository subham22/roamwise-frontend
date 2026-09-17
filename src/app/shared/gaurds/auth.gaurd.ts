import { inject, PLATFORM_ID } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { isPlatformBrowser } from "@angular/common";

export const AuthGaurd: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const isLoggedIn: boolean = authService.isLoggedIn();

    const platformId = inject(PLATFORM_ID);
    if (!isPlatformBrowser(platformId)) {
        return true;
    }


    if (!isLoggedIn) {
        router.navigate(["/"]);
    }

    return isLoggedIn;
}