import { Component, Input, OnInit } from '@angular/core';
import { ChatServiceService } from 'src/app/services/chat-service.service';
import { FormsModule } from '@angular/forms';
import ChatMessage from 'src/app/types/chat-message';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  private sub: any;
  private _pageName: string = "avernus";
  currentChatMessage: string = "";
  messageList: string[] = [];

  constructor(private route: ActivatedRoute, private chatService: ChatServiceService) { }

  public get pageName(): string {
    return this._pageName;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this._pageName = this.capitalise(params["pageName"]);
      console.log(`Page name: ${this._pageName}`);
    });
    this.chatService.joinRoom(this._pageName);
    this.chatService.getNewMessage().subscribe((message: string) => {
      this.messageList.push(message);
    })
  }

  ngOnDestroy() {
    this.chatService.disconnect();
  }

  capitalise(input: string): string {
    if(!input) {
      return '';
    }
    return input[0].toUpperCase() + input.substring(1);
  }

  sendMsg() {
    if(!this.currentChatMessage) {
      return;
    }
    let msg: ChatMessage = {
      room: this._pageName,
      user: "user",
      message: this.currentChatMessage,
    }
    this.chatService.publishMessage(msg, (callback: Function) => { console.log("ACKNOWLEDGEMENT " + callback)});
    this.currentChatMessage = '';
  }

}
