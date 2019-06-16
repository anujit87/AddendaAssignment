import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { Logout } from 'src/app/store/actions/user.action';
import { Tweet } from 'src/app/store/models/tweet.model';

@Component({
  selector: 'app-tweet-view',
  templateUrl: './tweet-view.component.html',
  styleUrls: ['./tweet-view.component.css']
})
export class TweetViewComponent implements OnInit {

  tweet:Tweet;
  errorMessage:string

  constructor(private store:Store<AppState>) { }

  ngOnInit() {
    //Get the selected Tweet from the store
    this.store.select('reducer').subscribe(
      state=>{
        console.log(state,state.selectedTweet)
        this.tweet=state.selectedTweet;
        this.errorMessage=state.errorMessage;
      }
    )
  }
  
  //Dispatch the logout action
  logOut(){
    this.store.dispatch(new Logout);
  }

}
