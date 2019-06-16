import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { FetchTweets, SelectTweet, Logout } from 'src/app/store/actions/user.action';
import { Tweet } from 'src/app/store/models/tweet.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  tweets:Tweet[];
  errorMessage:string;

  constructor( private store:Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(new FetchTweets());
    this.store.select('reducer').subscribe(
      state=>{
        //this.tweets=state.tweets
        console.log(state);
        this.errorMessage=state.errorMessage;
        if(Array.isArray(state.tweets)){
          const arr=state.tweets;
          arr.sort((a,b)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime());
          this.tweets=arr;
        }
      }
    )
  }

  onSelectTweet(id){
    this.store.dispatch(new SelectTweet(id));
  }

  logOut(): void {
    this.store.dispatch(new Logout);
  }

}
