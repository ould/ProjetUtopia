import { Component, Input } from '@angular/core';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import {
  share, mergeMap, debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { Chat } from '../gestionApp/interfaces/chat';
import { ChatService } from './chat.service';
import { PopupComponent } from '../gestionApp/popup/popup.component';


@Component({
    selector: 'app-chats',
    templateUrl: './chats.component.html',
    styleUrls: ['./chats.component.css'],
    standalone: false
})
export class ChatsComponent {

  constructor(private chatService: ChatService, private dialog: MatDialog) { }

  private searchTerms = new Subject<string>();
  private searchTermTemp = "";
  newChat: Chat = { _id: '', nom: '', antenne:'', messages: [] };

  search(term: string): void {
    this.searchTerms.next(term);
  }

  chats$?: Observable<Chat[]>;
  selectedChat?: Chat;

  ngOnInit(): void {
    this.chats$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.chatService.search(term)),
    );
  }

  openPopup(term: string) {
    this.searchTermTemp = term;
    const dialogRef = this.dialog.open(PopupComponent, {
      data: {
        title: 'Création Chat',
        message: 'Etes vous sur de vouloir créer le chat ' + term + ' ?',
        buttonYes: 'Oui',
        buttonNo: 'Non'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true && this.searchTermTemp) {
        // Action lorsque le bouton "Oui" est cliqué
        
       
      } else if (result === false) {
        // Action lorsque le bouton "Non" est cliqué
        console.log('Bouton Non cliqué');
      } else {
        // La boîte de dialogue est fermée sans clic sur un bouton
        console.log('Boîte de dialogue fermée');
      }
    });
  }

  selectChat(indexChat?: string): void {
    if(indexChat)
    this.chatService.get(indexChat).subscribe((response: Chat) => {
      this.selectedChat = response;
    });;
  }

  creerChat(): void {
    if (this.newChat.nom) {
      this.chatService.add(this.newChat).subscribe(chat => {
        //Sthis.newChat = { _id: '', nom: '', messages: [] };
        this.ngOnInit();
      });
    }
  }

}
