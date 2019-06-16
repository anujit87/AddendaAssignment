import { User } from './models/user.model';
import { createFeatureSelector } from '@ngrx/store';
import { Tweet } from './models/tweet.model';

export interface AppState{
    isAuthenticated:boolean;
    user: User | null;
    errorMessage:string | null;
    tweets: Tweet[] | null;
    selectedTweet: Tweet | null;
}

//export const selectUserState=createFeatureSelector<UserState>('user')

