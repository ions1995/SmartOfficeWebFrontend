import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.page.html',
  styleUrls: ['./userdetails.page.scss'],
})
export class UserdetailsPage implements OnInit {
  username: string  = '';
  firm: string = '';
  firstname: string = '';
  lastname: string = '';
  department: string = '';
  uidRFID: string = '';//mit ionic NFC auslesen???
  userCollectionRef: AngularFirestoreCollection;
  userRef: Observable<any>;
  constructor(public db: AngularFirestore) {
    this.userCollectionRef = this.db.collection('user');
    this.userRef = this.userCollectionRef.valueChanges();
   }

  ngOnInit() {
  }

  updateUser() {
    var user = firebase.auth().currentUser;
    console.log(this.department);
    console.log(this.firm);
    console.log(this.firstname);
    console.log(this.lastname);
    console.log(user.email);
    console.log(user.uid);
    console.log(this.uidRFID);
    console.log(this.username);
    this.userCollectionRef.doc(user.uid).set({
      username: this.username,
      mail: user.email,
      firm: this.firm,
      firstname: this.firstname,
      lastname: this.lastname,
      uidFire: user.uid,
      uidRFID: this.uidRFID,
      department: this.department
    });
  }


}
