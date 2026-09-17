import { HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { AuthService } from "../services/auth.service";

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
    const baseUrl = environment.apiUrl
    const service = inject(AuthService);
    const isAbsoluteUrl = /^https?:\/\//i.test(req.url);
    const token = service.token();
    let cloneReq = req;
    if (token) {
        cloneReq = cloneReq.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
    }
     if (!isAbsoluteUrl) {
        return next(cloneReq.clone({
             url: `${baseUrl}${req.url.startsWith('/') ? '' : '/'}${req.url}`
            
        }));
    }
    return next(req);
}