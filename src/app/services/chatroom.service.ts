import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import { LoadingService } from './loading.service';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { AlertService} from './alert.service';
import { AlertType } from './../enums/alert-type.enum';
import { Alert } from './../classes/alert';

@Injectable({
  providedIn: 'root'
})
export class ChatroomService {
  
  public chatrooms!: Observable<any>;
  public changeChatroom: BehaviorSubject<String | null> = new BehaviorSubject<String | null>(null);
  public selectedChatroom!: Observable<any>;
  public selectedChatroomMessages!: Observable<any>;

  constructor(private db: AngularFirestore, 
    private LoadingService: LoadingService, 
    private authService: AuthService,
    private alertService: AlertService) { 
    
    this.selectedChatroom = this.changeChatroom.pipe(switchMap( (chatroomId) => {
      if(chatroomId){
        return db.doc<any>(`chatrooms/${chatroomId}`).valueChanges();
      }
      return of(null);
    }));

    this.selectedChatroomMessages = this.changeChatroom.pipe(switchMap( (chatroomId) => {
      if(chatroomId){
        return db.collection<any>(`chatrooms/${chatroomId}/messages`, ref => {
          return ref.orderBy('createdAt', 'desc').limit(100);
        }).valueChanges().pipe(map(arr => arr.reverse()));
      }
      return of(null);
    }));

    this.chatrooms = db.collection<any>('chatrooms').valueChanges();
  }

  public createMessage(text: string): void {
    const chatroomId = this.changeChatroom.value;
    if(text.length > 0){
      const message = {
        message: text,
        createdAt: new Date(),
        sender: this.authService.currentUserSnapshot
      };
      this.db.collection<any>(`chatrooms/${chatroomId}/messages`).add(message);
    }else{
      this.alertService.alerts.next(new Alert('Lo sentimos el mensaje esta vacio', AlertType.Danger));
    }
    
  }

}
