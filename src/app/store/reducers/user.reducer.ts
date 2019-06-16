import { User } from '../models/user.model';
import { AppState } from '../app.state';
import * as UserActions from '../actions/user.action';

export const initialState: AppState={
    isAuthenticated:false,
    user:null,
    errorMessage:null,
    tweets:null,
    selectedTweet:null
}

function retrieveState(){
    if(localStorage.getItem('state')){
        return JSON.parse(localStorage.getItem('state'))
    }else{
        return initialState
    }
}

export function reducer(state:AppState,action:UserActions.Actions){
    state=retrieveState();
    switch(action.type){
        case UserActions.LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated:true,
                user:{
                    idToken:action.payload.idToken,
                    email:action.payload.email
                },
                errorMessage:null    
            };
        case UserActions.LOGIN_FAILURE:
            return {
                ...state,
                errorMessage:'Incorrect email/password'
            }
        case UserActions.LOGOUT:
            return {
                ...state,
                errorMessage:null
            };
        case UserActions.FETCH_TWEETS_SUCCESS:
            return {
                ...state,
                errorMessage:null,
                tweets:action.payload.tweets
            }
        case UserActions.FETCH_TWEETS_FAILURE:
            return {
                ...state,
                errorMessage:'Unable to fetch tweets'
            }
        case UserActions.SELECT_TWEET_SUCCESS:
            return{
                ...state,
                errorMessage:null,
                selectedTweet:action.payload.selectedTweet
            }
        case UserActions.SELECT_TWEET_FAILURE:
            return{
                ...state,
                errorMessage:'Unable to dislay tweet'
            }
        default:
            return state;
    }
}