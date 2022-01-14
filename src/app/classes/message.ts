import { User } from './user';

export class Message {
    message: String;
    createdAt: Date;
    sender: User;

    constructor(message: String, createdAt: Date, sender: User) {
        this.message = message;
        this.createdAt = createdAt;
        this.sender = new User(sender.firstName, sender.lastName, sender.photoUrl, sender.id);

    }
}
