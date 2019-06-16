import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, from, of } from 'rxjs';
import { LOGIN, Login, FetchTweetsSuccess, LoginSuccess, LoginFailure, LOGIN_SUCCESS, LOGIN_FAILURE, FETCH_TWEETS, FETCH_TWEETS_SUCCESS, FetchTweetsFailure, FETCH_TWEETS_FAILURE, SELECT_TWEET, SelectTweetSuccess, SelectTweet, SELECT_TWEET_SUCCESS, LOGOUT, SELECT_TWEET_FAILURE } from '../actions/user.action';
import { map, switchMap, catchError, tap, withLatestFrom} from 'rxjs/operators'
import { AppState } from '../app.state';

@Injectable()
export class UserEffects{
    constructor(private actions:Actions, private authService:AuthService, private store:Store<AppState>, private router:Router){

    }

    persistState(){
        this.store.select('reducer').subscribe(
            state=>{
                localStorage.setItem('state',JSON.stringify(state))
            }
        )
    }

    @Effect()
    Login:Observable<any>=this.actions.pipe(
        ofType(LOGIN),
        map((action:Login)=>action.payload),
        switchMap(payload=>{
            return this.authService.login(payload.email,payload.password).pipe(
                map(user=>{
                    console.log(user);
                    this.authService.setAuthTimer(parseInt(user.expiresIn,10));
                    this.authService.setAuth(user.idToken,parseInt(user.expiresIn,10));
                    return new LoginSuccess({idToken:user.idToken,email:payload.email})
                }), catchError(error=>{
                    console.log(error)
                    return of(new LoginFailure({error:error}));
                })
            )
        }));

    @Effect({dispatch:false})
    LoginSuccess:Observable<any> = this.actions.pipe(
        ofType(LOGIN_SUCCESS),
        tap(user=>{
            console.log(user)
            this.persistState();
            this.router.navigateByUrl('/profile');
        }));
    
    @Effect({dispatch:false})
    LoginFailure:Observable<any> = this.actions.pipe(
        ofType(LOGIN_FAILURE),
        tap(data=>{
            this.persistState()
        })
    );

    @Effect({dispatch:false})
    Logout:Observable<any> = this.actions.pipe(
        ofType(LOGOUT),
        tap(user=>{
            this.authService.logout();
            this.router.navigate(['/login'])
        })
    )

    @Effect()
    FetchTweets:Observable<any> = this.actions.pipe(
        ofType(FETCH_TWEETS),
        switchMap(payload=>{
            return this.authService.getTweets().pipe(
                map(tweets=>{
                    console.log(tweets);
                    return new FetchTweetsSuccess({tweets})
                }),catchError(error=>{
                    console.log(error);
                    return of(new FetchTweetsFailure({error}))
                })
            )
        })
    );

    @Effect({dispatch:false})
    FetchTweetsSuccess:Observable<any>= this.actions.pipe(
        ofType(FETCH_TWEETS_SUCCESS),
        tap(data=>{
            this.persistState();
            console.log(data)
        })
    );

    @Effect({dispatch:false})
    FetchTweetsFailure:Observable<any> = this.actions.pipe(
        ofType(FETCH_TWEETS_FAILURE),
        tap(data=>{
            this.persistState()
        })
    )

    @Effect()
    SelectTweet:Observable<any> = this.actions.pipe(
        ofType(SELECT_TWEET),
        map((action:SelectTweet)=>action.payload),
        withLatestFrom(this.store.select('reducer')),
        switchMap(([payload,storeState])=>{
            //console.log(payload);
            const tweets=storeState.tweets;
            let selectedTweet;
            if(Array.isArray(tweets)){
                selectedTweet=tweets.filter(tweet=>tweet.id===payload)[0];
                //console.log(tweets,action.payload)
                return of(new SelectTweetSuccess({selectedTweet}))
            }
        })
    );

    @Effect({dispatch:false})
    SelectTweetSuccess:Observable<any> = this.actions.pipe(
        ofType(SELECT_TWEET_SUCCESS),
        tap(data=>{
            console.log(data.payload);
            this.persistState();
            const id=data.payload.selectedTweet.id;
            this.router.navigate(['/tweet',id]);
        })
    );

    @Effect({dispatch:false})
    SelectTweetFailure:Observable<any> = this.actions.pipe(
        ofType(SELECT_TWEET_FAILURE),
        tap(data=>{
            this.persistState();
        })
    )
}