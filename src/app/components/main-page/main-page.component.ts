import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ChatServiceService } from 'src/app/services/chat-service.service';
import ChatMessage from 'src/app/types/chat-message';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  private sub: any;
  private _pageName: string = "avernus";
  currentChatMessage: string = "";
  @ViewChild('mainpage', {static: false}) messageContainer!: ElementRef;
  messageList: string[] = [];

  constructor(private route: ActivatedRoute, private chatService: ChatServiceService) { }

  public get pageName(): string {
    return this._pageName;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this._pageName = this.chatService.capitalise(params["pageName"]);
      console.log(`Page name: ${this._pageName}`);
    });
    this.chatService.joinRoom(this._pageName);
    this.chatService.getNewMessage().subscribe((message: ChatMessage) => {
      console.log(`RECEIVED MESSAGE`)
      console.log(message);
      this.appendMessageList(message);
      this.scrollToBottom();
      setTimeout(() => {
        this.scrollToBottom();
      }, 250); 
    })
  }

  scrollToBottom() {
    try {
      if(this.messageContainer && this.messageContainer.nativeElement) {
        if(!this.messageContainer.nativeElement.children || !this.messageContainer.nativeElement.children.length) {
          return;
        }
        let list = this.messageContainer.nativeElement.children[0].children;
        let offset = 0;
        if(list.length !== 0) {
          offset += list[0].scrollHeight;
        }
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }
    } catch( err ) {
      console.error(err);
    }
  }

  ngOnDestroy() {
    this.chatService.disconnect();
  }

  appendMessageList(msg: ChatMessage) {
    console.log("appendMessageList");
    console.log(msg);
    if(!msg || !msg.message || !(msg.message.trim())) {
      return;
    }
    const avatar = `https://avatars.dicebear.com/api/adventurer-neutral/${msg.user}.svg`
    const md = new Date();
    const messageDate = moment(md).format('DD/MM/YY hh:mm:ss');
    const messageTime = moment(md).format('hh:mm')
    let message = `<img class="avatar" src="${avatar}" title="${messageDate}" width="40px"> ${messageTime} ${msg.message}`;
    this.messageList.push(message);
  }



  sendMsg() {
    if(!this.currentChatMessage) {
      return;
    }
    let msg = new ChatMessage(this._pageName, "user", this.currentChatMessage);
    console.log("sendMsg");
    console.log(msg);
    this.chatService.publishMessage(msg, (callback: Function) => { console.log("ACKNOWLEDGEMENT " + callback)});
    this.currentChatMessage = '';
  }

}
