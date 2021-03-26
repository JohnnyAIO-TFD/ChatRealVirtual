import { Timestamp } from '@firebase/firestore-types';
import { User} from './user';

export class Message {
    message: String;
    createdAt: Timestamp;
    sender: User;
    
        constructor(message: String, createdAt: Timestamp, sender: User){
        this.message = message;
        this.createdAt = createdAt;
        this.sender = new User(sender.firstName, sender.lastName, sender.photoUrl, sender.id);

    }
}
