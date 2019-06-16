import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import { UserEffects } from './store/effects/user.effects';
import { reducer } from './store/reducers/user.reducer';
import { StoreModule } from '@ngrx/store';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ProfileComponent } from './components/profile/profile.component';
import { TweetViewComponent } from './components/tweet-view/tweet-view.component';
import { AuthGuard } from './auth/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    TweetViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot({reducer}),
    EffectsModule.forRoot([UserEffects]),
    RouterModule.forRoot([
      {path:'login', component: LoginComponent, pathMatch:'full'},
      {path:'profile', component:ProfileComponent, canActivate:[AuthGuard]},
      {path:'tweet/:id', component:TweetViewComponent, canActivate:[AuthGuard]},
      {path:'', redirectTo:'login', pathMatch:'full'},
      {path:'**', redirectTo:'login'}
    ])
  ],
  providers: [{
    provide:HTTP_INTERCEPTORS,
    useClass:AuthInterceptor,
    multi:true
  },AuthService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
