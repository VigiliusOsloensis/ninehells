import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client";
import ChatMessage from '../types/chat-message';
import { environment } from './../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  socket = io(environment.apiUrl)

  constructor() { }

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
    this.socket.on('message', (message: string) =>{
      this.message$.next(message);
    });    
    return this.message$.asObservable();
  };

}
