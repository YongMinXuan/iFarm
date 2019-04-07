import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

// Import firebase and firestore
import * as firebase from 'firebase';
import 'firebase/firestore';

/*
  Generated class for the DatabaseProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

  private _DB: any;
  private _COLL 		: string 			= "ChatRooms"

  constructor(public http: HttpClient) {
    console.log('Hello DatabaseProvider Provider');
    this._DB = firebase.firestore();
  }

  /**
  * Create the database collection and defines an initial document
  * Note the use of merge : true flag within the returned promise  - this
  * is needed to ensure that the collection is not repeatedly recreated should
  * this method be called again (we DON'T want to overwrite our documents!)
  */

  createAndPopulateDocument(collectionObj: string,
                            docID: string,
                            dataObj: any) : Promise<any>{
     return new Promise((resolve, reject) => {
       this._DB
       .collection(collectionObj)
       .doc(docID)
       .set(dataObj, {merge: true})
       .then((data : any) => {
         resolve(data);
       })
       .catch((error: any) => {
         reject(error);
       })
     })
  }

  /*
   * Return documents from specific database collection
   */

  getDocuments(collectionObj: string) : Promise<any>{
    return new Promise((resolve, reject) => {
      this._DB.collection(collectionObj)
      .orderBy("OfficialStartDate", "asc")
      .get()
      .then((querySnapshot) => {
        let obj : any = [];

        querySnapshot
        .forEach((doc: any) => {
          console.log(doc);
          obj.push({
           id             : doc.id,
           city           : doc.data().city,
           StartDate      : doc.data().StartDate,
           EndDate        : doc.data().EndDate,
           StartTime      : doc.data().StartTime,
           EndTime        : doc.data().EndTime,
           population     : doc.data().population,
           location   : doc.data().location,
           established    : doc.data().established,
           name: doc.data().name,
           user : doc.data().user,
           OfficialStartDate    : doc.data().OfficialStartDate,
          });
        });

        resolve(obj);
      })
      .catch((error : any) => {
        reject(error);
      });
    });
  }


  getchatid(collectionObj: string, roomName) : Promise<any>{
    return new Promise((resolve, reject) => {
      this._DB.collection(collectionObj)
      .where("roomname", "==", roomName )
      .get()
      .then((querySnapshot) => {
        let obj : any = [];

        querySnapshot
        .forEach((doc: any) => {
          console.log(doc);
          obj.push({
            id               : doc.id,
            eventuser           : doc.data().user1,
            attendeeuser     : doc.data().user2,                 
           
          });
        });

        resolve(obj);
      })
      .catch((error : any) => {
        reject(error);
      });
    });
  }

  getDocument(collectionObj: string, key: string) : Promise<any>{
    
    let user	            : string		= firebase.auth().currentUser.uid;
    return new Promise((resolve, reject) => {
      this._DB.collection(collectionObj).where("eventid", "==", key)    
      .get()
      .then((querySnapshot) => {
        let obj : any = [];

        querySnapshot
        .forEach((doc: any) => {
          console.log(doc);
          obj.push({
           id             : doc.id,
           city           : doc.data().city,
           StartDate      : doc.data().StartDate,
           EndDate        : doc.data().EndDate,
           StartTime      : doc.data().StartTime,
           EndTime        : doc.data().EndTime,
           population     : doc.data().population,
           location   : doc.data().location,
           established    : doc.data().established,
           user : doc.data().user,
          });
        });

        resolve(obj);
      })
      .catch((error : any) => {
        reject(error);
      });
    });
  }

  getIndividualChats(collectionObj: string,roomname:string) : Promise<any>{
    
    let user	            : string		= firebase.auth().currentUser.uid;
    console.log(roomname)
    return new Promise((resolve, reject) => {
      this._DB.collection(collectionObj).where("roomname","==",roomname)   
      .get()
      .then((querySnapshot) => {
        let obj : any = [];

        querySnapshot 
        .forEach((doc: any) => {
          console.log(doc);
          obj.push({
            id : doc.id,
            roomname : doc.data().roomname,
            eventuser :doc.data().user1,
            attendee :doc.data().user2
          });
        });

        resolve(obj);
      })
      .catch((error : any) => {
        reject(error);
      });
    });
  }

  getChatsList(collectionObj: string, name :string) : Promise<any>{
    
    let user	            : string		= firebase.auth().currentUser.uid;
    return new Promise((resolve, reject) => {
      this._DB.collection(collectionObj).where("user1", "==" , name)   
      .get()
      .then((querySnapshot) => {
        let obj : any = [];

        querySnapshot 
        .forEach((doc: any) => {
          console.log(doc);
          obj.push({
            id : doc.id,
            roomname : doc.data().roomname,
            user1 : doc.data().user1,
            user2 : doc.data().user2,
            user1name : doc.data().user1name,
            user2name : doc.data().user2name,
            lastmessage: doc.data().lastmessage,
            name : doc.data().name
          });
        });

        resolve(obj);
      })
      .catch((error : any) => {
        reject(error);
      });
    });
  }

  getChatsList2(collectionObj: string, name :string) : Promise<any>{
    
    let user	            : string		= firebase.auth().currentUser.uid;
    return new Promise((resolve, reject) => {
      this._DB.collection(collectionObj).where("user2", "==" , name)   
      .get()
      .then((querySnapshot) => {
        let obj : any = [];

        querySnapshot 
        .forEach((doc: any) => {
          console.log(doc);
          obj.push({
            id : doc.id,
            roomname : doc.data().roomname,
            user1 : doc.data().user1,
            user2 : doc.data().user2,
            user1name : doc.data().user1name,
            user2name : doc.data().user2name,
            lastmessage: doc.data().lastmessage,
            name : doc.data().name
          });
        });

        resolve(obj);
      })
      .catch((error : any) => {
        reject(error);
      });
    });
  }


  getChats(collectionObj: string) : Promise<any>{
    
    let user	            : string		= firebase.auth().currentUser.uid;
    return new Promise((resolve, reject) => {
      this._DB.collection(collectionObj)   
      .get()
      .then((querySnapshot) => {
        let obj : any = [];

        querySnapshot 
        .forEach((doc: any) => {
          console.log(doc);
          obj.push({
            id : doc.id,
            roomname : doc.data().roomname,
            image : doc.data().image,
          });
        });

        resolve(obj);
      })
      .catch((error : any) => {
        reject(error);
      });
    });
  }

  getChatMessages(collectionObj: string, collectionObj2) : Promise<any>{    
    let user	            : string		= firebase.auth().currentUser.uid;
    return new Promise((resolve, reject) => {
      this._DB.collection(collectionObj).doc(collectionObj2).collection("messages")
      .orderBy("sendDate", "asc")  
      .onSnapshot
      ((querySnapshot) => {
        let obj : any = [];
        querySnapshot 
        .forEach(function(doc) { 
          console.log(typeof doc);
          console.log(doc);
          obj.push({
            id : doc.id,
            message : doc.data().message,
            type : doc.data().type,
            user :doc.data().user,
            image: doc.data().image,
            profilepic: doc.data().profilepic 
          });
        });

        resolve(obj);
      })
      
    });
  }

  /**
   * Add a new document to a selected database collection
   */

  addDocument(collectionObj : string,
              dataObj : any) : Promise<any>{
    return new Promise((resolve, reject) => {
      this._DB.collection(collectionObj).add(dataObj)
      .then((obj : any) => {
        resolve(obj);
      })
      .catch((error : any) => {
        reject(error);
      });
    });
  }

  addChat(collectionObj : string,
    dataObj : any) : Promise<any>{
return new Promise((resolve, reject) => {
this._DB.collection(collectionObj).add(dataObj)
.then((obj : any) => {
resolve(obj);
})
.catch((error : any) => {
reject(error);
});
});
}

sendchatmessage(collectionObj : string, collectionObj2 : string,
  dataObj : any) : Promise<any>{
return new Promise((resolve, reject) => {
firebase.firestore().collection(collectionObj).doc(collectionObj2).collection('messages').add(dataObj)
.then((obj : any) => {
resolve(obj);
})
.catch((error : any) => {
reject(error);
});
});
}

  /**
   * Delete an existing document from a selected database collection
   */

   deleteDocument(collectionObj : string,
                  docID : string) : Promise<any>{
      return new Promise((resolve, reject) => {
        this._DB
        .collection(collectionObj)
        .doc(docID)
        .delete()
        .then((obj : any) => {
          resolve(obj);
        })
        .catch((error : any) => {
          reject(error);
        });
      });
    }

    /**
     * Update an existing document within a selected database collection
     */

    updateDocument(collectionObj : string,
                    docID : string,
                    dataObj : any) : Promise<any>{
      return new Promise((resolve, reject) => {
        this._DB
        .collection(collectionObj)
        .doc(docID)
        .update(dataObj)
        .then((obj : any) => {
          resolve(obj);
        })
        .catch((error : any) => {
          reject(error);
        });
      });
    }
}
