import { Component, Input } from '@angular/core';
import { Chat } from 'src/app/gestionApp/interfaces/chat';
import { Location } from '@angular/common';

@Component({
    selector: 'app-chat-detail',
    templateUrl: './chat-detail.component.html',
    styleUrls: ['./chat-detail.component.css'],
    standalone: false
})
export class ChatDetailComponent {


  constructor(private location: Location) {

  }

  @Input() ChatInput!: Chat;


}
