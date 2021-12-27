import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from "socket.io-client";
import ChatMessage from '../types/chat-message';
import { environment } from './../../environments/environment'

const defaultChatMessage = new ChatMessage();

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  public message$: BehaviorSubject<ChatMessage> = new BehaviorSubject(defaultChatMessage);
  private socket!: Socket;

  constructor() { }

  async login() {
    this.socket = io(environment.apiUrl);    
  }

  loggedIn(): boolean {
    return !!(this.socket);
  }

  logout() {
    this.socket && this.socket.disconnect();
  }

  capitalise(input: string): string {
    if(!input) {
      return '';
    }
    return input[0].toUpperCase() + input.substring(1);
  }

  publishMessage(msg: ChatMessage, callback: Function) {
    this.socket.emit("message", {msg: msg.message, roomName: msg.room}, callback);
  }

  joinRoom = (roomName: string) => {
    this.socket.emit('join', roomName);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
  
  public getNewMessage = () => {
    this.socket.on('message', (message: ChatMessage) =>{
      this.message$.next(message);
    });    
    return this.message$.asObservable();
  };

}
