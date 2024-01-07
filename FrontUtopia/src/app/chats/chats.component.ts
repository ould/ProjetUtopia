import { Component, Input } from '@angular/core';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import {
  share, mergeMap, debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { Chat } from '../interfaces/chat';
import { ChatService } from './chat.service';


@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent {

  constructor(private ChatService: ChatService) {}

  private searchTerms = new Subject<string>();

  search(term: string): void {
    this.searchTerms.next(term);
  }

  chats$?: Observable<Chat[]>;
  selectedChat?:Chat;

  ngOnInit(): void {

    // this.chats$ = timer(0, 5000).pipe(
    //   mergeMap(() => this.ChatService.searchChats()),
    //   share(),
    // );
    this.chats$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.ChatService.searchChats(term)),
    );
  }

  selectChat(indexChat: number):void{
    this.ChatService.getChat(indexChat).subscribe((response:Chat) => {
      this.selectedChat = response;
  });;
  }

  

}
