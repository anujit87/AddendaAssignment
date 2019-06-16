import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

export const LOGIN = '[User] Login';
export const LOGIN_SUCCESS = '[User] Login Success';
export const LOGIN_FAILURE = '[User] Login Failure';
export const LOGOUT = '[User] Logout';
export const FETCH_TWEETS = 'Fetch Tweets';
export const FETCH_TWEETS_SUCCESS = 'Fetch Tweets Success';
export const FETCH_TWEETS_FAILURE = 'Fetch Tweets Failure';
export const SELECT_TWEET = 'Select Tweet';
export const SELECT_TWEET_SUCCESS = 'Select Tweet Success';
export const SELECT_TWEET_FAILURE = 'Select Tweet Failure';

export class Login implements Action{
    readonly type=LOGIN
    constructor(public payload:User){}
}

export class LoginSuccess implements Action{
    readonly type=LOGIN_SUCCESS;
    constructor(public payload:any){}
}

export class LoginFailure implements Action{
    readonly type=LOGIN_FAILURE;
    constructor(public payload:any){}
}

export class Logout implements Action{
    readonly type=LOGOUT;
}

export class FetchTweets implements Action{
    readonly type=FETCH_TWEETS
    //constructor(public payload:any){}
}
export class FetchTweetsSuccess implements Action{
    readonly type=FETCH_TWEETS_SUCCESS
    constructor(public payload:any){}
}
export class FetchTweetsFailure implements Action{
    readonly type=FETCH_TWEETS_FAILURE
    constructor(public payload:any){}
}

export class SelectTweet implements Action{
    readonly type=SELECT_TWEET;
    constructor(public payload:any){}
}

export class SelectTweetSuccess implements Action{
    readonly type=SELECT_TWEET_SUCCESS;
    constructor(public payload:any){}
}

export class SelectTweetFailure implements Action{
    readonly type=SELECT_TWEET_FAILURE;
    constructor(public payload:any){}
}


export type Actions=Login 
| LoginSuccess 
| LoginFailure 
| Logout 
| FetchTweets 
| FetchTweetsSuccess 
| FetchTweetsFailure 
| SelectTweet 
| SelectTweetSuccess 
| SelectTweetFailure;
