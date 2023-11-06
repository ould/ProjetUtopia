import { Component, Input } from '@angular/core';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import {
  share, mergeMap
} from 'rxjs/operators';

import { Chat } from '../interfaces/chat';
import { ChatService } from './chat.service';


@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent {
  /**
   *
   */
  constructor(private ChatService: ChatService) {

  }
  chats$?: Observable<Chat[]>;
  selectedChat?:Chat;

  ngOnInit(): void {

    this.chats$ = timer(0, 5000).pipe(
      mergeMap(() => this.ChatService.searchChats()),
      share(),
    );
  }

  selectChat(indexChat: number):void{
    this.ChatService.getChat(indexChat).subscribe((response:Chat) => {
      this.selectedChat = response;
  });;
  }

  

}
