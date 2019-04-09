import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, NavController, NavParams, LoadingController,ActionSheetController, } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database.service';
import * as moment from 'moment';
import { Firebase } from '@ionic-native/firebase'
import firebase from 'firebase';
import { CalendarComponentOptions } from 'ion2-calendar'
import { ModalController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpClient } from '@angular/common/http';
import { ImagePicker } from '@ionic-native/image-picker';
import { CalendarModal, CalendarModalOptions, DayConfig, CalendarResult } from "ion2-calendar";
@IonicPage()
@Component({
  selector: 'question',
  templateUrl: 'question.html',
})
export class QuestionPage {
   image: string;

   ionViewDidLoad() {
      console.log(firebase.auth().currentUser);
   }  

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
   public location    : string          = '';
   
    /**
    * @name StartDate
    * @type {object}
    * @public
    * @description     Defines an object for returning documents from Cloud Firestore database
    */
   public StartDate       : Date;

   /**
    * @name EndDate
    * @type {object}
    * @public
    * @description     Defines an object for returning documents from Cloud Firestore database
    */
   public EndDate       : Date;

   public starting       : string;
   public ending      : string;
   public start      : any;

    /**
    * @name StartTime
    * @type {object}
    * @public
    * @description     Defines an object for returning documents from Cloud Firestore database
    */
   public StartTime       : Date;

   /**
    * @name EndDate
    * @type {object}
    * @public
    * @description     Defines an object for returning documents from Cloud Firestore database
    */
   public EndTime       : Date;

   public OfficialStartDate       : Date;



   /**
    * @name established
    * @type {string}
    * @public
    * @description     Model for established form field
    */
   public established 	: string          = '';



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

   public date:  string;

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
   private _COLL 		: string 			= "Events";


   constructor(public navCtrl        : NavController,
               public params         : NavParams,
               private _FB 	         : FormBuilder,
               private _DB           : DatabaseProvider,
               private _ALERT        : AlertController,
               public modalCtrl: ModalController,
               private loadingCtrl: LoadingController,
               private camera: Camera,
               private http: HttpClient,
               public imagePicker: ImagePicker,
               private actionSheetCtrl: ActionSheetController)
   {

      // Use Formbuilder API to create a FormGroup object
      // that will be used to programmatically control the
      // form / form fields in the component template
      this.form 		= _FB.group({
         'city' 		        : ['', Validators.required],
         'StartDate' 		        : ['', Validators.required],
         'EndDate' 		        : ['', Validators.required],
         'StartTime' 		        : ['', Validators.required],
         'EndTime' 		        : ['', Validators.required],
         'location' 		        : ['', Validators.required],
         'population' 	        : ['', Validators.required],
         'established'	        : ['', Validators.required],
         'OfficialStartDate'	        : ['', Validators.required]
      });


      // If we have navigation parameters then we need to
      // parse these as we know these will be used for
      // editing an existing record
      if(params.get('isEdited'))
      {
          let record 		        = params.get('record');

          this.city	           = record.location.city;
          this.population   	  = record.location.population;
          this.StartDate	     = record.location.StartDate;
          this.StartTime	     = record.location.StartTime;
          this.EndTime	     = record.location.EndTime;
          this.EndDate	         = record.location.EndDate;
          this.established      = record.location.established;
          this.location     = record.location.location;
          this.docID            = record.location.id;
          this.OfficialStartDate      = record.location.OfficialStartDate
          ;
          this.isEditable       = true;
          this.title            = 'Update this document';
      }
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
   {
      let city	            : string		= this.form.controls["city"].value,
         StartDate        : string 		= this.form.controls["StartDate"].value,
         EndDate       : string 		= this.form.controls["EndDate"].value,
         StartTime        : string 		= this.form.controls["StartTime"].value,
         EndTime       : string 		= this.form.controls["EndTime"].value,
          population        : string 		= this.form.controls["population"].value,
          location        : string 		= this.form.controls["location"].value,
         established       : string		= this.form.controls["established"].value,
         user	            : string		= firebase.auth().currentUser.uid,
         name	            : string		= firebase.auth().currentUser.displayName,
         OfficialStartDate       : Date		= this.form.controls["OfficialStartDate"].value;
         ;

      // console.log(StartDate);
      // console.log(new Date(StartDate));
      // console.log(new Date(StartDate).setMinutes(new Date(StartDate).getMinutes() - new Date(StartDate).getTimezoneOffset()));
      // console.log(new Date(StartDate).setMinutes(new Date(StartDate).getMinutes() + new Date(StartDate).getTimezoneOffset())
      // );
      // console.log(moment().format(StartDate));
      // console.log(typeof moment().format(StartDate));
      // console.log(new Date(moment().format(StartDate)));
      // console.log(EndDate);
      // If we are editing an existing record then handle this scenario
      if(this.isEditable)
      {

         if(this.image){

            let loading = this.loadingCtrl.create({
               content: "Uploading Image..."
             })
         
             loading.present();
         
             let ref = firebase.storage().ref("GroupImages/" + name);
         
             let uploadTask = ref.putString(this.image.split(',')[1], "base64");
         
             uploadTask.on("state_changed", (taskSnapshot: any) => {
               console.log(taskSnapshot)
               let percentage = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100;
               loading.setContent("Uploaded " + percentage + "% ...")
         
             }, (error) => {
               console.log(error)
             }, () => {
               console.log("The upload is complete!");
         
               uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                     this._DB.updateDocument(this._COLL,
                               this.docID,
                               {
                                  city    		 : city,
                                  StartDate    	: StartDate,
                                 EndDate        :EndDate,
                                 StartTime    	: StartTime,
                                 EndTime      :EndTime,
                                  population    : population,
                                  location    : location,
                                  established   : established,
                                  name   : name,
                                  user : user,
                                 image: url,
                                 OfficialStartDate : OfficialStartDate

                                  
	                           })
         .then((data) =>
         {
            this.clearForm();
            this.displayAlert('Success', 'The document was successfully updated');
         })
         .catch((error) =>
         {
            this.displayAlert('Updating document failed', error.message);
         });


               }).catch((err) => {
                  loading.dismiss()
                  
                })
                
              })
              loading.dismiss()
              this.navCtrl.pop()

         }

         else{
            this._DB.updateDocument(this._COLL,
               this.docID,
               {
                  city    		 : city,
                  StartDate    	: StartDate,
                 EndDate        :EndDate,
                 StartTime    	: StartTime,
                 EndTime      :EndTime,
                  population    : population,
                  location    : location,
                  established   : established,
                  name   : name,
                  user : user,
                  image: "https://firebasestorage.googleapis.com/v0/b/ifarm-a79f0.appspot.com/o/4k-wallpaper-close-up-dew-807598%20(1).jpg?alt=media&token=afe0194c-1b51-4108-9140-138050998e2f",
                  OfficialStartDate : OfficialStartDate

                  
              }).then((data) =>
              {
                 
                 this.displayAlert('Success', 'The document was successfully updated');
              }) .catch((error) =>
              {
                 this.displayAlert('Updating document failed', error.message);
              });


          }

         
         
      }

      // Otherwise we are adding a new record
      else
      {
         if(this.image){

            let loading = this.loadingCtrl.create({
               content: "Uploading Image..."
             })
         
             loading.present();
         
             let ref = firebase.storage().ref("GroupImages/" + name);
         
             let uploadTask = ref.putString(this.image.split(',')[1], "base64");
         
             uploadTask.on("state_changed", (taskSnapshot: any) => {
               console.log(taskSnapshot)
               let percentage = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100;
               loading.setContent("Uploaded " + percentage + "% ...")
         
             }, (error) => {
               console.log(error)
             }, () => {
               console.log("The upload is complete!");
         
               uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                     this._DB.addDocument(this._COLL,
                              
                               {
                                  city    		 : city,
                                  StartDate    	: StartDate,
                                 EndDate        :EndDate,
                                 StartTime    	: StartTime,
                                 EndTime      :EndTime,
                                  population    : population,
                                  location    : location,
                                  established   : established,
                                  name   : name,
                                  user : user,
                                 image: url,
                                 OfficialStartDate : OfficialStartDate

                                  
	                           })
         .then((data) =>
         {
            
            this.displayAlert('Success', 'The document was successfully updated');
         })
         .catch((error) =>
         {
            this.displayAlert('Updating document failed', error.message);
         });


               }).catch((err) => {
                  loading.dismiss()
                  
                })
                
              })
              loading.dismiss()
              this.navCtrl.pop()
        
      }

      else{
         this._DB.addDocument(this._COLL,
            
            {
               city    		 : city,
               StartDate    	: StartDate,
              EndDate        :EndDate,
              StartTime    	: StartTime,
              EndTime      :EndTime,
               population    : population,
               location    : location,
               established   : established,
               name   : name,
               user : user,
               image: "https://firebasestorage.googleapis.com/v0/b/ifarm-a79f0.appspot.com/o/4k-wallpaper-close-up-dew-807598%20(1).jpg?alt=media&token=afe0194c-1b51-4108-9140-138050998e2f",
               OfficialStartDate : OfficialStartDate

               
           }).then((data) =>
           {
              
              this.displayAlert('Success', 'The document was successfully updated');
           }) .catch((error) =>
           {
              this.displayAlert('Updating document failed', error.message);
           });
      }


   }
}
   // StartDate    	: new Date(moment().format(StartDate)),
   // EndDate         :new Date(moment().format(EndDate)),


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

   addPhoto(){
      this.actionSheetCtrl.create({
        buttons: [
          {
            text: "Camera",
            handler: () => {
              console.log();
              console.log("Camera");
              
    
                this.launchCamera();
                console.log("Before Modal Cntrl")
            
            
              
            }
          },
          {
            text: "Image Gallery",
            handler: () => {
              console.log("Image Gallery");
              this.openImagePicker();
    
            }
          }
        ]
      }).present();
    
    }
    
    openImagePicker(){
      this.imagePicker.hasReadPermission().then(
        (result) => {
    
          if(result == false){
            // no callbacks required as this opens a popup which returns async
            this.imagePicker.requestReadPermission();
          }
          else if(result == true){
            const options = {
              maximumImagesCount: 1,
              quality: 75,
              width: 512,
              height: 512,
              outputType: 1
              }
    
            this.imagePicker.getPictures(options).then(
              (results) => {
               
                   this.image = "data:image/jpeg;base64," + results;              
               
              }, (err) => console.log(err)
            );
          }
        }, (err) => {
          console.log(err);
        });
      }
    
    launchCamera() {
      let options: CameraOptions = {
        quality: 100,
        sourceType: this.camera.PictureSourceType.CAMERA,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        targetHeight: 512,
        targetWidth: 512,
        allowEdit: true
      }
    
      this.camera.getPicture(options).then((base64Image) => {
        console.log(base64Image);
    
        this.image = "data:image/png;base64," + base64Image;
    
    
      }).catch((err) => {
        console.log(err)
      })
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

   dateRange: { from: string; to: string; };
   type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
   optionsRange: CalendarComponentOptions = {
     pickMode: 'range'
   };

   openCalendar() {
      const options: CalendarModalOptions = {
        pickMode: 'range',
        title: 'RANGE'
      };
  
      let myCalendar = this.modalCtrl.create(CalendarModal, {
        options: options
      });
  
      myCalendar.present();
  
      myCalendar.onDidDismiss((date: { from: CalendarResult; to: CalendarResult }, type: string) => {
         console.log(date);
         console.log(typeof date.to.time);
         console.log(date.from.dateObj);
         console.log(new Date(date.to.time*1000));
         console.log(new Date(date.to.time));
         this.starting = moment(date.from.time).format('Do MMM YYYY');;
         this.ending = moment(date.to.time).format('Do MMM YYYY');
         this.start = date.from.time;
         console.log(typeof this.starting);
      });
}

 

   myDate = moment(new Date().toISOString()).locale('es').format();

   
}