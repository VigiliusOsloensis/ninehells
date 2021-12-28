import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ChatServiceService } from 'src/app/services/chat-service.service';
import ChatMessage from 'src/app/types/chat-message';
import * as moment from 'moment';
import Web3 from 'web3';

declare global {
  interface Window {
      ethereum: any;
  }
}

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  private sub: any;
  private _pageName: string = "avernus";
  private _address!: string;
  currentChatMessage: string = "";
  @ViewChild('mainpage', {static: false}) messageContainer!: ElementRef;
  messageList: string[] = [];
  web3Provider:any = null;

  constructor(private chatService: ChatServiceService) { }

  public get pageName(): string {
    return this._pageName;
  }

  public loggedIn(): boolean {
    return this.chatService.loggedIn();
  }

  ngOnInit() {
  }

  public signInWithMetaMask() {
    let ethereum = window.ethereum;
    if (typeof ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
    } else {
      alert("The MetaMask extension is missing.\n\nGet it at https://metamask.io");
      return;
    }
    if (ethereum) {
      this.web3Provider = ethereum;
      try {
        // Request account access
        ethereum.request({ method: 'eth_requestAccounts' }).then( (address:any) => {
          console.log("Account connected: ", address[0]); // Account address that you had imported
          this.loginAfterMetaMask(address[0]);
        });
      } catch (error) {
        // User denied account access...
        console.error("User denied account access");
      }
    }  }

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

  async login() {
    this.signInWithMetaMask();
  }

  async loginAfterMetaMask(address: string) {
    if(!address) {
      console.log("address is empty, stopping");
      return;
    }
    console.log("logging in");
    this._address = address;
    await this.chatService.login();
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

  sendMsg() {
    if(!this.currentChatMessage) {
      return;
    }
    let msg = new ChatMessage(this._pageName, this._address, this.currentChatMessage);
    console.log("sendMsg");
    console.log(msg);
    this.chatService.publishMessage(msg, (callback: Function) => { console.log("ACKNOWLEDGEMENT " + callback)});
    this.currentChatMessage = '';
  }

}
