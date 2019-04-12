import { ArticlesPage } from './../articles/articles';
import { Component } from '@angular/core';
// import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ActionSheetController, AlertController, ModalController, Modal } from 'ionic-angular';
import firebase from 'firebase';
import moment from 'moment';
import { LoginPage } from '../login/login';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpClient } from '@angular/common/http';
import { CommentsPage } from '../comments/comments';
import { Firebase } from '@ionic-native/firebase'
import {App} from 'ionic-angular';
import { DatabaseProvider } from './../../providers/database/database.service';
import { ImagePicker } from '@ionic-native/image-picker';

/**
 * Generated class for the FeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {
  text: string = "";
  posts: any[] = [];
  pageSize: number = 50;
  cursor: any;
  infiniteEvent: any;
  image: string;
  size: any;
  
  constructor(private app: App, public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private camera: Camera, private http: HttpClient, private actionSheetCtrl: ActionSheetController, private _DB     : DatabaseProvider, private alertCtrl: AlertController, private modalCtrl: ModalController, private firebaseCordova: Firebase,public imagePicker: ImagePicker,) {
    this.getPosts();

    this.firebaseCordova.getToken().then((token) => {
      console.log(token)

      this.updateToken(token, firebase.auth().currentUser.uid);

    }).catch((err) => {
      console.log(err)
    })
    

  }
  user_identification(post){
      
    console.log(post);
    console.log((post.data()));
    // console.log(obj.id);
    // console.log(firebase.auth().currentUser.uid);
    if (post.data().owner == firebase.auth().currentUser.uid){
       return true;
    }
    else{
       return false;
    }
 }
  
  updateToken(token: string, uid: string){

    firebase.firestore().collection("users").doc(uid).set({
      token: token,
      tokenUpdate: firebase.firestore.FieldValue.serverTimestamp()
    }, {
      merge: true
    }).then(() => {
      console.log("token saved to cloud firestore");
    }).catch(err => {
      console.log(err);
    })

  }

  deleteDocument(obj) : void
   {
  console.log("is this working?")
   let alert  = this.alertCtrl.create({
        title      : "Are you Sure?",
        // message: 'Message <strong>text</strong>!!!',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Okay',
            handler: () => {
              this._DB.deleteDocument('posts',
      						obj.id)
      .then((data : any) =>
      {
         this.displayAlert('Success', 'The post was successfully removed');
      })
      .catch((error : any) =>
      {
         this.displayAlert('Error', error.message);
      });
            }
          }
        ]
      });
      alert.present();
   }

   displayAlert(title      : string,
                message    : string) : void
   {
      let alert : any     = this.alertCtrl.create({
         title      : title,
         subTitle   : message,
         buttons    : [{
          text      : 'Got It!',
          handler   : () =>
          {
            this.getPosts();
          }
        }]
      });
      alert.present();
   }

  getPosts() {

    this.posts = [];

    let loading = this.loadingCtrl.create({
      content: "Loading Feed..."
    });

    loading.present();

    let query = firebase.firestore().collection("posts").orderBy("created", "desc").limit(this.pageSize);

    query.onSnapshot((snapshot) => {
      let changedDocs = snapshot.docChanges();

      changedDocs.forEach((change) => {
        if (change.type == "added") {
          // TODO
        }

        if (change.type == "modified") {
          for (let i = 0; i < this.posts.length; i++) {
            if (this.posts[i].id == change.doc.id) {
              this.posts[i] = change.doc;
            }
          }
        }

        if (change.type == "removed") {
          // TODO
        }
      })
    })

    query.get()
      .then((docs) => {

        docs.forEach((doc) => {
          this.posts.push(doc);
        })

        loading.dismiss();

        this.cursor = this.posts[this.posts.length - 1];

        console.log(this.posts)

      }).catch((err) => {
        console.log(err)
      })
  }

  loadMorePosts(event) {

    firebase.firestore().collection("posts").orderBy("created", "desc").startAfter(this.cursor).limit(this.pageSize).get()
      .then((docs) => {

        docs.forEach((doc) => {
          this.posts.push(doc);
        })

        console.log(this.posts)

        if (docs.size < this.pageSize) {
          // all documents have been loaded
          event.enable(false);
          this.infiniteEvent = event;
        } else {
          event.complete();
          this.cursor = this.posts[this.posts.length - 1];
        }

      }).catch((err) => {
        console.log(err)
      })

  }

  refresh(event) {

    this.posts = [];

    this.getPosts();

    if (this.infiniteEvent) {
      this.infiniteEvent.enable(true);
    }

    event.complete();

  }

  articles(){
    this.navCtrl.push(ArticlesPage);
  }

  post() {
    console.log(firebase.auth().currentUser.uid);
    firebase.firestore().collection("posts").add({
      // likesCount: 0,
      text: this.text,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      owner: firebase.auth().currentUser.uid,      
      owner_name: firebase.auth().currentUser.displayName
    }).then(async (doc) => {
      console.log(doc)

      if (this.image) {
        await this.upload(doc.id)
      }

      this.text = "";
      this.image = undefined;

      let toast = this.toastCtrl.create({
        message: "Your post has been created successfully.",
        duration: 3000
      }).present();

      this.getPosts();
    }).catch((err) => {
      console.log(err)
    })

  }

  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }

  logout() {

    firebase.auth().signOut().then(() => {

      let toast = this.toastCtrl.create({
        message: "You have been logged out successfully.",
        duration: 3000
      }).present();

      // this.navCtrl.setRoot('LoginPage');
      this.app.getRootNav().setRoot('LoginPage');


    });

  }

  addPhoto() {

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

  upload(name: string) {

    return new Promise((resolve, reject) => {

      let loading = this.loadingCtrl.create({
        content: "Uploading Image..."
      })

      loading.present();

      let ref = firebase.storage().ref("postImages/" + name);

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

          firebase.firestore().collection("posts").doc(name).update({
            image: url
          }).then(() => {
            loading.dismiss()
            resolve()
          }).catch((err) => {
            loading.dismiss()
            reject()
          })

        }).catch((err) => {
          loading.dismiss()
          reject()
        })

      })

    })

  }

  like(post) {

    let body = {
      postId: post.id,
      userId: firebase.auth().currentUser.uid,
      action: post.data().likes && post.data().likes[firebase.auth().currentUser.uid] == true ? "unlike" : "like"
    }
    console.log(body);
    let toast = this.toastCtrl.create({
      message: "Updating like... Please wait."
    });

    toast.present();

    this.http.post("https://ifarmfyp.herokuapp.com/https://us-central1-ifarm-a79f0.cloudfunctions.net/updateLikesCount", JSON.stringify(body), {
      responseType: "text"
    }).subscribe((data) => {
      console.log(data)
     toast.setMessage("Like updated!");
      setTimeout(() => {
        toast.dismiss();
      }, 3000)

    }, (error) => {
      toast.setMessage("An error has occured. Please try again later.")
      setTimeout(() => {
        toast.dismiss();
      }, 3000)
      console.log(error)
    })

  }

  comment(post) {

    this.actionSheetCtrl.create({
      buttons: [
        {
          text: "View All Comments",
          handler: () => {
            this.modalCtrl.create(CommentsPage, {
              "post": post
            }).present();
          }
        },
        {
          text: "New Comment",
          handler: () => {
            
            this.alertCtrl.create({
              title: "New Comment",
              message: "Type your comment",
              inputs: [
                { 
                  name: "comment",
                  type: "text"
                }
              ],
              buttons: [
                {
                  text: "Cancel"
                },
                {
                  text: "Post",
                  handler: (data) => {
                    
                    if(data.comment){

                      firebase.firestore().collection("comments").add({
                        text: data.comment,
                        post: post.id,
                        owner: firebase.auth().currentUser.uid,
                        owner_name: firebase.auth().currentUser.displayName,
                        created: firebase.firestore.FieldValue.serverTimestamp()
                      }).then((doc) => {
                        this.toastCtrl.create({
                          message: "Comment posted successfully.",
                          duration: 3000
                        }).present();
                      }).catch((err) => {
                        this.toastCtrl.create({
                          message: err.message,
                          duration: 3000
                        }).present();
                      })

                      firebase.firestore().collection('comments').where("post", "==", post.id).get().then(snap => {
                        this.size = snap.size // will return the collection size
                        console.log("new")
                        console.log(this.size)
                        firebase.firestore().collection('posts').doc(post.id).update({commentsCount: this.size})
                        
                     });

                    }

                  }
                }
              ]
            }).present();

          }
        }
      ]
    }).present();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedPage');
  }

}
