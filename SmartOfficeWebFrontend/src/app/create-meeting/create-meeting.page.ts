import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

import { DataService } from '../services/data.service';

@Component({
  selector: 'app-create-meeting',
  templateUrl: './create-meeting.page.html',
  styleUrls: ['./create-meeting.page.scss'],
})
export class CreateMeetingPage implements OnInit {
  data: any;
  raumAuswahl;
  verpflichtendeEinladungen;
  optionaleEinladungen;
  dateFrom;
  timeFrom;
  dateTo;
  timeTo;
  bewirtungsauswahl;
  username;

  flag: boolean = false;

  userCollectionRef: AngularFirestoreCollection;
  userRef: Observable<any>;
  meetingCollectionRef: AngularFirestoreCollection;
  meetingRef: Observable<any>;

  constructor(private route: ActivatedRoute, private router: Router, private db: AngularFirestore, private dataService: DataService) {
    this.userCollectionRef = this.db.collection('user');
    this.userRef = this.userCollectionRef.valueChanges();

    this.meetingCollectionRef = this.db.collection('meetings');
    this.meetingRef = this.userCollectionRef.valueChanges();
  }

  ngOnInit() {
    if (this.route.snapshot.data['special']) {
      this.data = this.route.snapshot.data['special'];
    }

    //Raum nach der Auswahl auf der Übersicht setzen
    this.raumAuswahl = this.dataService.getData(1);
    console.log(this.dataService.getData(1));

    //Gastgeber setzen
    var user = firebase.auth().currentUser;
    this.userCollectionRef.doc(user.uid).valueChanges().forEach((user1) => {
      this.username = user1.username;
    });
  }

  checkMeeting(): boolean {
    this.flag = false;

     //prüfen
    this.db.collection('meetings').valueChanges().forEach((doc1) => {
      doc1.forEach((field1) => {
        console.log(field1.room);
        console.log(field1.dateAndTimeEnd.toDate());
        //existieren Meetings mit dem gleichen Raum?
        if (field1.room === this.raumAuswahl) {
          console.log(field1.room);
          //https://firebase.google.com/docs/reference/android/com/google/firebase/Timestamp
          //existieren Meetings mit dem gleichen Datum?


          //esistieren Meetings deren Zeitraum den ausgewählten "berühren"
          //hierfür muss die Zeit (angegeben) in Nanosekunden umgerechnet werden und daraufhin verglichen werden 


          //mehr wird nicht geprüft!!!


        }
      });
    });



    //flag = true setzen


    return this.flag;

  }

  saveMeeting() {

    if (this.checkMeeting()) {

    }
  }

}
