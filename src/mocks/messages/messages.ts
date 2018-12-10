import {Message} from '../../models/messages/message.interface';
// import { Profile } from '../../models/user/user.interface';
import { USER_LIST } from '../profiles/profiles';

const userList  = USER_LIST;
const messageList: Message[] = [];

userList.forEach((user) => {
    messageList.push({user: user, date: new Date(), lastMessage: "This is bullshit"})
})

// const messageList: Message[] = [
//     {
//         User: userList[0], date :new Date()
//     },
//     {
//         User: userList[1], date :new Date()
//     },
//     {
//         User: userList[2], date :new Date()
//     }
// ]

export const MESSAGE_LIST = messageList;