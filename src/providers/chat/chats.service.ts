import { FIREBASE_CONFIG } from './../../app/app.firebase.config';
import { Chat, User } from './../../models/chat/chats.models';
import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "angularfire2/firestore";

@Injectable()
export class ChatService {
  users: AngularFirestoreCollection<User>;

  chats: AngularFirestoreCollection<Chat>;

  //The pair string for the two users currently chatting
  currentChatPairId;
  currentChatPartner;

  constructor(private db: AngularFirestore) {
    
    this.users = db.collection<User>(FIREBASE_CONFIG.users_endpoint);
    this.chats = db.collection<Chat>(FIREBASE_CONFIG.chats_endpoint);
  }

  addUser(payload) {
    return this.users.add(payload);
  } //addUser

  addChat(chat: Chat) {
    return this.chats.add(chat);
  } //addChat

  createPairId(user1, user2) {
    let pairId;
    if (user1.time < user2.time) {
      pairId = `${user1.email}|${user2.email}`;
    } else {
      pairId = `${user2.email}|${user1.email}`;
    }

    return pairId;
  } //createPairString

}