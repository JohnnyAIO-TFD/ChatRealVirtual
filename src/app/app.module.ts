import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AlertModule } from 'ngx-bootstrap/alert';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

//Firebase
import { AngularFireModule} from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule} from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';

//Services
import { AlertService } from './services/alert.service';
import { NgxLoadingModule } from 'ngx-loading';
import { AuthService } from './services/auth.service';
import { ChatroomService } from './services/chatroom.service';
import { LoadingService } from './services/loading.service';

//Guards
import { AuthGuard } from './guards/auth.guard';
import { IsOwnerGuard} from './guards/is-owner.guard';

//Components
import {LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ChatComponent } from './pages/chat/chat.component';
import { ChatInputComponent } from './pages/chat/components/chat-input/chat-input.component';
import { ChatroomListComponent } from './pages/chat/components/chatroom-list/chatroom-list.component';
import { ChatroomTitleBarComponent } from './pages/chat/components/chatroom-title-bar/chatroom-title-bar.component';
import { ChatMessageComponent } from './pages/chat/components/chat-message/chat-message.component';
import { ChatroomWindowComponent } from './pages/chat/components/chatroom-window/chatroom-window.component';
import { environment } from 'src/environments/environment';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';




@NgModule({
  declarations: [AppComponent, LoginComponent, SignupComponent, NavbarComponent, ChatComponent, ChatInputComponent, ChatroomListComponent, ChatroomTitleBarComponent, ChatMessageComponent, ChatroomWindowComponent, ProfileComponent, EditProfileComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AlertModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    NgxLoadingModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFirestoreModule
  ],
  providers: [AlertService, AuthService, LoadingService, AuthGuard, ChatroomService, IsOwnerGuard],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
