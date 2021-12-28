import * as moment from "moment";

enum ChatMessageType {
    message,
    join,
    disconnect
}

export default class ChatMessage {
    room!: string;
    user!: string;
    uid!: string;
    message!: string;
    type: ChatMessageType = ChatMessageType.message;

    constructor(room = "", user = "", message = "", uid = "", type = ChatMessageType.message) {
        this.room = room;
        this.user = user;
        this.message = message;
        this.type = type;
    }

}