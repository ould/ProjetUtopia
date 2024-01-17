import { Component, Input } from '@angular/core';
import { Chat } from 'src/app/interfaces/chat';
import { Location } from '@angular/common';

@Component({
  selector: 'app-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.css']
})
export class ChatDetailComponent {


  constructor(private location: Location) {

  }

  @Input() ChatInput!: Chat;


}
