import { User } from 'firebase';
import { DatabaseProvider } from './../../providers/database/database.service';
import { Component } from '@angular/core';
import { NavController, AlertController, IonicPage,NavParams } from 'ionic-angular';
import firebase from 'firebase';
@IonicPage()
@Component({
  selector: 'questionfirst',
  templateUrl: 'questionfirst.html'
})
export class QuestionFirstPage {



   /**
    * @name _COLL
    * @type {string}
    * @private
    * @description      Defines the name of the database collection
    */
   private _COLL 		: string 			= "Events";
   private _COLL2 		: string 			= "Individual_Chats";




   /**
    * @name _DOC
    * @type {string}
    * @private
    * @description      Defines the initial document ID for the database collection
    */
   private _DOC 		: string 			= "Xy76Re34SdFR1";




   /**
    * @name _CONTENT
    * @type {any}
    * @private
    * @description      Used to store/provide the initial document data for the database collection
    */
   private _CONTENT  	: any;



   /**
    * @name locations
    * @type {any}
    * @public
    * @description      Property to store the returned documents from the database collection
    */
   public locations     : any;



   constructor(public navCtrl  : NavController,
               private _DB     : DatabaseProvider,
               private _ALERT  : AlertController, public navParams: NavParams)
   {
      this._CONTENT = {
         city 			: "London",
         population 	: "8,787,892",
         established    : "C. 43 AD"
      };
   }




   /**
    * Retrieve all documents from the specified collection using the
    * retrieveCollection method when the view is entered
    *
    * @public
    * @method ionViewDidEnter
    * @return {none}
    */
   ionViewDidEnter()
   {
      this.retrieveCollection();
   }



   /**
    * Creates the collection and populates that with an initial document
    * using the createAndPopulateDocument method of the DatabaseProvider
    * service
    *
    * @public
    * @method generateCollectionAndDocument
    * @return {none}
    */
   generateCollectionAndDocument() : void
   {
      this._DB.createAndPopulateDocument(this._COLL,
                                         this._DOC,
                                         this._CONTENT)
      .then((data : any) =>
      {
         console.dir(data);
      })
      .catch((error : any) =>
      {
         console.dir(error);
      });
   }




   /**
    * Retrieve all documents from the specified collection using the
    * getDocuments method of the DatabaseProvider service
    *
    * @public
    * @method retrieveCollection
    * @return {none}
    */
   retrieveCollection() : void
   {
      this._DB.getDocuments(this._COLL)
      .then((data) =>
      {
         console.log(data);
         // IF we don't have any documents then the collection doesn't exist
         // so we create it!
         if(data.length === 0)
         {
            // this.generateCollectionAndDocument();
         }

         // Otherwise the collection does exist and we assign the returned
         // documents to the public property of locations so this can be
         // iterated through in the component template
         else
         {
            this.locations = data;
         }
      })
      .catch();
   }
   
   user_identification(obj){
      
      // console.log(obj.user);
      // console.log(obj.id);
      // console.log(firebase.auth().currentUser.uid);
      if (obj.user == firebase.auth().currentUser.uid){
         return true;
      }
      else{
         return false;
      }
   }

   user_identification_register(obj){
      
      // console.log(obj.user);
      // console.log(obj.id);
      // console.log(firebase.auth().currentUser.uid);
      if (obj.user !== firebase.auth().currentUser.uid){
         return true;
      }
      else{
         return false;
      }
   }


   /**
    * Navigate to the manage-document component to begin adding a new document
    *
    * @public
    * @method addDocument
    * @return {none}
    */
   addDocument() : void
   {
      this.navCtrl.push('QuestionPage');
   }

   signup_event(location)
   {  
      console.log(location)
      this.navCtrl.push('SignupPage',{
         data: location
       });
       
       
   }

   chat(location){
      // let user1 = 
      // if 
      console.log(location.user)
      console.log(firebase.auth().currentUser.uid)
      var user1 = location.user;
      var user2 = firebase.auth().currentUser.uid;
      var roomName = 'chat_'+(user1<user2 ? user1+'_'+user2 : user2+'_'+user1);
      console.log(roomName)

      this._DB.getIndividualChats(this._COLL2,roomName).then((data) =>
      {
         console.log(data);
         // IF we don't have any documents then the collection doesn't exist
         // so we create it!
         if(data.length === 0)
         {
           //  this.generateCollectionAndDocument();
           this._DB.addDocument(this._COLL2,
            {
               user1: location.user,
               user2: firebase.auth().currentUser.uid,
               user1name: location.name,
               user2name: firebase.auth().currentUser.displayName,
               roomname : roomName
          }).then((data) =>
          {
             console.log("Added Success")
             console.log(data);
             console.log(data.id);
             this.joinRoom(data.id)
          })
          .catch((error) =>
          {
             this.displayAlert('Adding document failed', error.message);
          });

         }
 
         // Otherwise the collection does exist and we assign the returned
         // documents to the public property of locations so this can be
         // iterated through in the component template
         else
         {
            // this.chats = data;
            console.log('Record Already exists')
            // this.joinRoom()
            console.log(user1)
            console.log(user2)
            this._DB.getchatid(this._COLL2,roomName)    
            .then((data) =>
            {
               console.log(data);
               console.log(data.id)
               console.log(data[0])
               console.log(data[0].id)
               this.joinRoom(data[0].id)
           
            })
            .catch((error) =>
            {
               this.displayAlert('Adding document failed', error.message);
            });
         }
      })
      .catch();
      console.log('Check it here')
     
   }

   view(location)
   {
      this.navCtrl.push('AttendeesPage',{
         data: location
       });
       
   }

   joinRoom(key) {
      this.navCtrl.setRoot('IndividualchatPage', {
        key:key,
        
      });
    }


   /**
    * Update a document by passing the data to the manage-document component
    *
    * @public
    * @method updateDocument
    * @param  obj          {Object}           The document data we wish to update
    * @return {none}
    */
   updateDocument(obj) : void
   {
      let params : any = {
         collection   : this._COLL,
         location     : obj
      };
      this.navCtrl.push('QuestionPage', { record : params, isEdited : true });
   }




   /**
    * Delete a document from the Cloud Firestore collection using the
    * deleteDocument method of the DatabaseProvider service
    *
    * @public
    * @method deleteDocument
    * @param  obj          {Object}           The document ID for the document we wish to delete
    * @return {none}
    */
   deleteDocument(obj) : void
   {
      this._DB.deleteDocument(this._COLL,
      						obj.id)
      .then((data : any) =>
      {
         this.displayAlert('Success', 'The record ' + obj.city + ' was successfully removed');
      })
      .catch((error : any) =>
      {
         this.displayAlert('Error', error.message);
      });
   }




   /**
    * Provide feedback to user after an operation has succeeded/failed
    *
    * @public
    * @method displayAlert
    * @param  title          {String}           Heading for alert message
    * @param  message        {String}           Content for alert message
    * @return {none}
    */
   displayAlert(title      : string,
                message    : string) : void
   {
      let alert : any     = this._ALERT.create({
         title      : title,
         subTitle   : message,
         buttons    : [{
          text      : 'Got It!',
          handler   : () =>
          {
            this.retrieveCollection();
          }
        }]
      });
      alert.present();
   }

   refresh(event) {

      this.retrieveCollection();
  
      event.complete();
  
    }

}