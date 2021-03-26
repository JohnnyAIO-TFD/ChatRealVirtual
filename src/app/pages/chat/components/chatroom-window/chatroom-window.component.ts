import { Component, OnDestroy, OnInit, AfterViewChecked, ElementRef, ViewChild  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ChatroomService } from '../../../../services/chatroom.service';
import { LoadingService } from '../../../../services/loading.service';

@Component({
  selector: 'app-chatroom-window',
  templateUrl: './chatroom-window.component.html',
  styleUrls: ['./chatroom-window.component.scss']
})
export class ChatroomWindowComponent implements OnInit, OnDestroy {

  @ViewChild('scrollContainer')
  private scrollContainer!: ElementRef;

  private subscriptions: Subscription[] = [];
  public chatroom!: Observable<any>;
  public messages!: Observable<any>;
//TODO replace with Firebase Data

  constructor(private route: ActivatedRoute, 
    private chatroomService: ChatroomService,
    private loadingService: LoadingService) { 
      this.subscriptions.push(
        this.chatroomService.selectedChatroom.subscribe(chatroom => {
          this.chatroom = chatroom;
        })
      );
      this.subscriptions.push(
        this.chatroomService.selectedChatroomMessages.subscribe(messages => {
          this.messages = messages;
        })
      );
    }//end-constructor

  ngOnInit(): void {
    this.scrollBottom();
    this.subscriptions.push(
      this.route.paramMap.subscribe(params => {
        const chatroomId = params.get('chatroomId');
        this.chatroomService.changeChatroom.next(chatroomId);
      })
      
    );
  }//end-OnInit

  ngAfterViewChecked(){
    this.scrollBottom();
  }

  ngOnDestroy(){
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }//end-Destroy

  private scrollBottom(): void{
    try{
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) {

    }//end-catch
  }//end-scroll
}
