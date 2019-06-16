import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../store/models/user.model';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  
  tokenTimer:any;
  isAuthenticated:boolean=false;
  constructor( private http:HttpClient) { }
  
  //Get token from the localstorage
  getToken():string{
    return localStorage.getItem('token');
  }
  
  //Check if User is Authenticated
  getIsAuthenticated(){
    return this.isAuthenticated;
  }

  login(email:string,password:string):Observable<any>{
    const url='https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyD8W0pWlju6wOPr3ih_aio2gNiVKHd9F8g';
    return this.http.post(url,{email,password,returnSecureToken:true});
  }

  getTweets():Observable<any>{
    const url=' https://angular-sample-twitter.firebaseio.com/tweets.json?auth=';
    return this.http.get(url);
  }

  setAuthTimer(duration:number){
    this.tokenTimer = setTimeout(()=>{
      this.logout();
    },duration*1000);
  }

  setAuth(token:string,duration:number){
    const now = new Date();
    const expiryDate = new Date(now.getTime()+duration*1000);
    localStorage.setItem('expiryDate',expiryDate.toISOString());
    localStorage.setItem('token',token);
    this.isAuthenticated=true;
  }
  
  //Get User Auth data
  getAuth(){
    const token = localStorage.getItem('token');
    const expiryDate = localStorage.getItem('expiryDate');
    if(!token || !expiryDate){
      return;
    }else{
      return {
        token:token,
        expiryDate:new Date(expiryDate)
      }
    }
  }
  
  //Update the token expiry timer 
  autoAuthUser(){
    const authInfo = this.getAuth();
    if(!authInfo){
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expiryDate.getTime()-now.getTime();
    if(expiresIn>0){
      this.isAuthenticated=true;
      this.setAuthTimer(expiresIn/100);
    }else{
      this.logout();
    }
  }
  
  //Logout the user
  logout(){
    clearTimeout(this.tokenTimer)
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('state');
  }
}
