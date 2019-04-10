import { DatabaseProvider } from './../../providers/database/database.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import 'firebase/firestore'
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  

  



   /**
    * @name form
    * @type {object}
    * @public
    * @description     Defines an object for handling form validation
    */
   public form          : any;



   /**
    * @name records
    * @type {object}
    * @public
    * @description     Defines an object for returning documents from Cloud Firestore database
    */
   public records       : any;



   /**
    * @name city
    * @type {string}
    * @public
    * @description     Model for city form field
    */
   public city          : string          = '';



   /**
    * @name population
    * @type {string}
    * @public
    * @description     Model for population form field
    */
   public population    : string          = '';

   /**
    * @name population
    * @type {string}
    * @public
    * @description     Model for population form field
    */
   public eventid    : string          = '';



   /**
    * @name established
    * @type {string}
    * @public
    * @description     Model for established form field
    */
   public established 	: string          = '';

   public counts : any;

   /**
    * @name docID
    * @type {string}
    * @public
    * @description     property that stores an edited document's ID
    */
   public docID         : string          = '';



   /**
    * @name isEditable
    * @type {boolean}
    * @public
    * @description     property that stores value to signify whether
                       we are editing an existing document or not
    */
   public isEditable    : boolean         = false;



   /**
    * @name title
    * @type {string}
    * @public
    * @description     property that defines the template title value
    */
   public title 		: string		   = 'Add a new document';



   /**
    * @name _COLL
    * @type {string}
    * @private
    * @description     property that stores the value for the database collection
    */
   private _COLL 		: string 			= "Attendees";


   constructor(public navCtrl        : NavController,
               public params         : NavParams,
               private _FB 	         : FormBuilder,
               private _DB           : DatabaseProvider,
               private _ALERT        : AlertController)
   {
      // Use Formbuilder API to create a FormGroup object
      // that will be used to programmatically control the
      // form / form fields in the component template
      this.form 		= _FB.group({
         'city' 		        : ['', Validators.required],
         'population' 	        : ['', Validators.required],
         'established'	        : ['', Validators.required]
      });
      

      // If we have navigation parameters then we need to
      // parse these as we know these will be used for
      // editing an existing record
      if(params.get('isEdited'))
      {
          let record 		        = params.get('record');

          this.city	            = record.location.city;
          this.population   	  = record.location.population;
          this.established      = record.location.established;
          this.docID            = record.location.id;
          this.isEditable       = true;
          this.title            = 'Update this document';
      }
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
   /**
    * Saves form data as newly added/edited record within Firebase Realtime
    * database and handles uploading of media asset to Firebase Storage
    *
    * @public
    * @method saveDocument
    * @param  val          {any}              Form data
    * @return {none}
    */
   saveDocument(val : any) : void
   {console.log(this.counts);

      let city	            : string		= this.form.controls["city"].value,
	 	      population        : string 		= this.form.controls["population"].value,
  		    established       : string		= this.form.controls["established"].value,
          eventid	            : string		= this.params.data.data.id,
          user	            : string		= firebase.auth().currentUser.uid,
          image	            : string		= firebase.auth().currentUser.photoURL;
          ;

          console.log(this.counts)
         //  this.counts = 0;
          console.log(this.counts)
     
           console.log('loook here');
          console.log(this.counts);
         //  console.log(counter);
// console.log(counter);
// console.log(typeof counter);


      // If we are editing an existing record then handle this scenario
      if(this.counts > 0)
      {
         
            let alert = this._ALERT.create({
              title: 'Registered?!?!?!',
              subTitle: 'You have already Registered',
              buttons: ['Dismiss']
            });
            alert.present();
          this.navCtrl.pop();
         // Call the DatabaseProvider service and pass/format the data for use
         // with the updateDocument method
         // this._DB.addDocument(this._COLL,
         //                      //  this.docID,
         //                       {
	      //                          city    		 : city,
	      //                          population    : population,
         //                         established   : established,
         //                         eventid : eventid,
         //                         user : user
	      //                      })
         // .then((data) =>
         // {
         //    this.clearForm();
         //    this.displayAlert('Success', 'The document ' +  city + ' was successfully registered');
         // })
         // .catch((error) =>
         // {
         //    this.displayAlert('Updating document failed', error.message);
         // });
      }

      // Otherwise we are adding a new record
      else
      {

         // Call the DatabaseProvider service and pass/format the data for use
         // with the addDocument method
         this._DB.addDocument(this._COLL,
                            {
	                           city    		 : city,
	                           population    : population,
                             established   : established,
                             eventid: eventid,
                             user : user,
                             image: image
	                        })
         .then((data) =>
         {
            this.clearForm();
            this.displayAlert('Record added', +  city + ' was successfully registered');
            this.navCtrl.pop();
         })
         .catch((error) =>
         {
            this.displayAlert('Adding document failed', error.message);
         });
      }
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
         buttons    : ['Got it!']
      });
      alert.present();
   }

   displayRegisterAlert(title      : string,
      message    : string) : void
{
let alert : any     = this._ALERT.create({
title      : title,
subTitle   : message,
buttons    : ['Got it!']
});
alert.present();
}



   /**
    * Clear all form data
    *
    * @public
    * @method clearForm
    * @return {none}
    */
   clearForm() : void
   {
      this.city  					= '';
      this.population				= '';
      this.established 				= '';
   }
 

}


//  ionViewDidLoad() {
//     console.log(this.navParams.data);
//     console.log(this.navParams.data.id);
//     console.log(this.navParams.data.data.id);
//   }