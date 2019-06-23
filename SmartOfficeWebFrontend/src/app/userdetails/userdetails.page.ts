import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';


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
  uidRFID: string = '';//mit ionic NFC auslesen???--> eher weniger
  userCollectionRef: AngularFirestoreCollection<any>;
  userRef: Observable<any>;
  constructor(public db: AngularFirestore, private dataService: DataService) {
    this.userCollectionRef = this.db.collection('user');
    this.userRef = this.userCollectionRef.valueChanges();
    //User-Daten auslesen und in die entsprechenden Felder eintragen
   }

  ngOnInit() {
    var user = this.dataService.getData(2);
    this.userCollectionRef.doc(user.uid).valueChanges().forEach((user1) => {
      this.username = user1['username'];
      this.firm = user1['firm'];
      this.firstname = user1['firstname'];
      this.lastname = user1['lastname'];
      this.department = user1['department'];
      this.uidRFID = user1['uidRFID'];
    });
  }

  updateUser() {
    var user = this.dataService.getData(2);
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
