import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/store/models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { Login } from 'src/app/store/actions/user.action';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  user:User = new User();
  errorMessage:string | null;

  constructor( private store:Store<AppState>) {
    
   }

  ngOnInit() {

    //Get the error Message from the store
    this.store.select('reducer').subscribe(
      state=>{
        console.log(state)
        this.errorMessage=state.errorMessage;
      }
    )
  }
  
  //Dispatch the login Action
  onLogin(){
    console.log(this.user)
    const payload={
      email:this.user.email,
      password:this.user.password
    }
    console.log(payload)
    this.store.dispatch(new Login(payload));
  }

}
