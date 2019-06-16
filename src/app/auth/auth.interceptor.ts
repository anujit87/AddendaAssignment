import { HttpInterceptor, HttpRequest, HttpHandler} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable()

export class AuthInterceptor implements HttpInterceptor{

    constructor(private authService:AuthService){}
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if(req.url==='https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyD8W0pWlju6wOPr3ih_aio2gNiVKHd9F8g'){
            return next.handle(req);
        }else{
            const idToken = this.authService.getToken();
            const authRequest = req.clone({ url: req.url + idToken });
            return next.handle(authRequest);
        }
        
    }
    


}