import { DatabaseProvider } from './../../providers/database/database.service';
import { Component } from '@angular/core';
import { NavController, AlertController, IonicPage, NavParams } from 'ionic-angular';
import firebase from 'firebase';

/**
 * Generated class for the AttendeesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-attendees',
  templateUrl: 'attendees.html',
})
export class AttendeesPage {
   public counts : any;
   public counting : any;

 /**
    * @name _COLL
    * @type {string}
    * @private
    * @description      Defines the name of the database collection
    */
   private _COLL 		: string 			= "Attendees";




   /**
    * @name _DOC
    * @type {string}
    * @private
    * @description      Defines the initial document ID for the database collection
    */
   private _DOC 		: string 			= "Xy76Re34SdFR1";

   public isEditable    : boolean         = false;


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
               private _ALERT  : AlertController,
               public params         : NavParams)
   {
      this._CONTENT = {
         city 			: "London",
         population 	: "8,787,892",
         established    : "C. 43 AD"
      };
   }

   ionViewDidLoad() {
      let  eventid	            : string		= this.params.data.data.id,
      user	            : string		= firebase.auth().currentUser.uid;
     let counting = firebase.firestore().collection(this._COLL).where("eventid", "==", eventid).where('user', '==', user).get().then(doc => {
         if (!doc) {
           console.log('No such document!');
         } else {
           console.log('Document data:', doc.docs);
           var docSnapshots = doc.docs;
           this.counts = doc.size 
           for (var i in docSnapshots) {
            // this.counts += 1;
            return this.counts
            // const doc = docSnapshots[i].data();
            // console.log(doc);
            // console.log(this.counts)
            // Check for your document data here and break when you find it
            // return this.counts;
        }
         }
       })
       .catch(err => {
         console.log('Error getting document', err);
       });
     
      //  console.log(this.counts);
       console.log(counting);
       counting.then((data) => {
         // here we're receiving data from the promise      
            this.saveCar(data);
         });
  }
  
  saveCar(data) { // Now we're getting here from within the then
       this.counts = data; // data get's assigned to this.carInfo instance
       console.log(this.counts); // log the carInfo
    }

   ionViewDidEnter()
   {
      this.retrieveCollection();
   }

   retrieveCollection() : void
   { let  eventid	            : string		= this.params.data.data.id
      this._DB.getDocument(this._COLL, eventid)
      .then((data) =>
      {
         console.log(data);
         // IF we don't have any documents then the collection doesn't exist
         // so we create it!
         if(data.length === 0)
         {
            this.counting = data.length
            // this.generateCollectionAndDocument();
         }

         // Otherwise the collection does exist and we assign the returned
         // documents to the public property of locations so this can be
         // iterated through in the component template
         else
         {
            this.locations = data;
            this.counting = data.length
         }
      })
      .catch();
   }

  

   refresh(event) {

      this.retrieveCollection();
  
      event.complete();
  
    } 
   data = { roomname:'' };
  ref = firebase.database().ref('indivchatrooms/');

  chat(location) {
   let chat = location.id;
   console.log(location.id);
   let newData = this.ref.push();
   newData.set({
     roomname: chat
   });
   
 }

}
