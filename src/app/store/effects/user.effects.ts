import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, from, of } from 'rxjs';
import * as UserActions from '../actions/user.action';
import { map, switchMap, catchError, tap, withLatestFrom} from 'rxjs/operators'
import { AppState } from '../app.state';

@Injectable()
export class UserEffects{
    constructor(private actions:Actions, private authService:AuthService, private store:Store<AppState>, private router:Router){

    }
    
    //Persist the state in localstorage sothat it can be retrieved when page is refreshed.
    persistState(){
        this.store.select('reducer').subscribe(
            state=>{
                localStorage.setItem('state',JSON.stringify(state))
            }
        )
    }

    @Effect()
    Login:Observable<any>=this.actions.pipe(
        ofType(UserActions.LOGIN),
        map((action:UserActions.Login)=>action.payload),
        switchMap(payload=>{
            return this.authService.login(payload.email,payload.password).pipe(
                map(user=>{
                    console.log(user);
                    this.authService.setAuthTimer(parseInt(user.expiresIn,10));
                    this.authService.setAuth(user.idToken,parseInt(user.expiresIn,10));
                    return new UserActions.LoginSuccess({idToken:user.idToken,email:payload.email})
                }), catchError(error=>{
                    console.log(error)
                    return of(new UserActions.LoginFailure({error:error}));
                })
            )
        }));

    @Effect({dispatch:false})
    LoginSuccess:Observable<any> = this.actions.pipe(
        ofType(UserActions.LOGIN_SUCCESS),
        tap(user=>{
            console.log(user)
            this.persistState();
            this.router.navigateByUrl('/profile');
        }));
    
    @Effect({dispatch:false})
    LoginFailure:Observable<any> = this.actions.pipe(
        ofType(UserActions.LOGIN_FAILURE),
        tap(data=>{
            this.persistState()
        })
    );

    @Effect({dispatch:false})
    Logout:Observable<any> = this.actions.pipe(
        ofType(UserActions.LOGOUT),
        tap(user=>{
            this.authService.logout();
            this.router.navigate(['/login'])
        })
    )

    @Effect()
    FetchTweets:Observable<any> = this.actions.pipe(
        ofType(UserActions.FETCH_TWEETS),
        switchMap(payload=>{
            return this.authService.getTweets().pipe(
                map(tweets=>{
                    console.log(tweets);
                    return new UserActions.FetchTweetsSuccess({tweets})
                }),catchError(error=>{
                    console.log(error);
                    return of(new UserActions.FetchTweetsFailure({error}))
                })
            )
        })
    );

    @Effect({dispatch:false})
    FetchTweetsSuccess:Observable<any>= this.actions.pipe(
        ofType(UserActions.FETCH_TWEETS_SUCCESS),
        tap(data=>{
            this.persistState();
            console.log(data)
        })
    );

    @Effect({dispatch:false})
    FetchTweetsFailure:Observable<any> = this.actions.pipe(
        ofType(UserActions.FETCH_TWEETS_FAILURE),
        tap(data=>{
            this.persistState()
        })
    )

    @Effect()
    SelectTweet:Observable<any> = this.actions.pipe(
        ofType(UserActions.SELECT_TWEET),
        map((action:UserActions.SelectTweet)=>action.payload),
        withLatestFrom(this.store.select('reducer')),
        switchMap(([payload,storeState])=>{
            const tweets=storeState.tweets;
            let selectedTweet;
            if(Array.isArray(tweets)){
                selectedTweet=tweets.filter(tweet=>tweet.id===payload)[0];
                return of(new UserActions.SelectTweetSuccess({selectedTweet}))
            }
        }),
        catchError(error=>{
            return of(new UserActions.SelectTweetFailure({error}))
        })
    );

    @Effect({dispatch:false})
    SelectTweetSuccess:Observable<any> = this.actions.pipe(
        ofType(UserActions.SELECT_TWEET_SUCCESS),
        tap(data=>{
            console.log(data.payload);
            this.persistState();
            const id=data.payload.selectedTweet.id;
            this.router.navigate(['/tweet',id]);
        })
    );

    @Effect({dispatch:false})
    SelectTweetFailure:Observable<any> = this.actions.pipe(
        ofType(UserActions.SELECT_TWEET_FAILURE),
        tap(data=>{
            this.persistState();
        })
    )
}