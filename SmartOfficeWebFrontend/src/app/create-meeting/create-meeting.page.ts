import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

import { DataService } from '../services/data.service';
import { delay } from 'q';

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
  dateTo;
  bewirtungsauswahl;
  username;
  user;

  flag: boolean = false;

  userCollectionRef: AngularFirestoreCollection<any>;
  userRef: Observable<any>;
  meetingCollectionRef: AngularFirestoreCollection<any>;
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
    this.user = firebase.auth().currentUser;
    this.userCollectionRef.doc(this.user.uid).valueChanges().forEach((user1) => {
      this.username = user1['username'];
    });
  }

/**
 * prüfen
 * */
  async checkMeeting() {
    this.flag = false;
    let dateFrom = new Date(this.dateFrom);
    let dateTo = new Date(this.dateTo);

    console.log('1: ' + this.flag);

    var query = this.db.collection('/meetings/', ref => ref
    .where('room', '==', this.raumAuswahl)).valueChanges();
    console.log(query);

    query.forEach(document => {
      console.log('1,2: ' + document);
      if (document.length === 0) {
        this.flag = true;
        console.log('1,5: ' + this.flag);
        return;
      } else {
        for (var i = 0; i < document.length; i++){
          console.log('1.6: ' + document[i]['room']);
          console.log('1.6.1: ' + document[i]['dateAndTimeStart']);
          console.log('1.6.2: ' + document[i]['dateAndTimeEnd']);
          let dateFireFrom = new Date(document[i]['dateAndTimeStart'].toDate());
          let dateFireTo = new Date(document[i]['dateAndTimeEnd'].toDate());
          console.log('dateFireFrom: ' + dateFireFrom);
          console.log('dateFireTo: ' + dateFireTo);
          console.log('dateFrom: ' + dateFrom);
          console.log('dateTo: ' + dateTo);
          console.log('dateFrom < dateFireFrom');
          console.log(dateFrom < dateFireFrom);
          console.log('dateTo <= dateFireFrom');
          console.log(dateTo <= dateFireFrom);
          console.log('dateFrom >= dateFireTo');
          console.log(dateFrom >= dateFireTo);
          console.log('dateTo > dateFireTo');
          console.log(dateTo > dateFireTo);
          if ((dateFrom < dateFireFrom && dateTo <= dateFireFrom) || (dateFrom >= dateFireTo && dateTo > dateFireTo)) {
            this.flag = true;
            console.log('1,7: ' + this.flag);
          } else {
            console.log('1.8: ' + this.flag);
          }
        }
      }
    });
    console.log('2: ' + this.flag);
  }

  async saveMeeting() {
    console.log('3: ' + this.flag);
    this.checkMeeting();
    await delay(5000);
    console.log('4: ' + this.flag);
    if (this.flag) {
      console.log('5: ' + this.flag);
      this.meetingCollectionRef.add({
        bewirtung: this.bewirtungsauswahl,
        dateAndTimeEnd: this.dateFrom,
        dateAndTimeStart: this.dateTo,
        hostID: this.user.uid,
        hostName: this.username,
        optional: this.optionaleEinladungen,
        verpflichtend: this.verpflichtendeEinladungen
      }).then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
    }
  }

}
