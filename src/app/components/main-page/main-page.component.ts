import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ChatServiceService } from 'src/app/services/chat-service.service';
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
  @ViewChild('messages', {static: false}) messageContainer!: ElementRef;
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
      this.appendMessageList(message);
      console.log(this.messageContainer)
      const height = (this.messageContainer) ? this.messageContainer.nativeElement.offsetHeight + this.messageContainer.nativeElement.offsetTop: 0;
      window.scrollTo(0, height);
    })
  }

  ngOnDestroy() {
    this.chatService.disconnect();
  }

  appendMessageList(msg: string) {
    if(!msg || !(msg.trim())) {
      return;
    }
    this.messageList.push(msg);
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
