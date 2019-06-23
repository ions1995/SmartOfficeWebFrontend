import { Component, Query } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { delay } from 'q';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public meetingCollectionRef: AngularFirestoreCollection<any>;
  public meetingRef: Observable<any>;

  user;

  //benötigt zum sortieren
  userID;
  verpflichtendeEinladungen;
  optionaleEinladungen;
  dateFrom;
  dateTo;


  //liste anzeigen
  query;

  deleteArray = [];

  constructor(
    private router: Router, private dataService: DataService, public db: AngularFirestore) {
      this.meetingCollectionRef = this.db.collection('meetings');
      this.meetingRef = this.meetingCollectionRef.valueChanges();

      this.userID = this.dataService.getData(2);

      this.reload();

      this.query = this.db.collection('/meetings/', ref => ref.limit(3)).valueChanges();
      console.log(this.query);
      /*var query = this.db.collection('/meetings/', ref => ref
    .where('room', '==', this.raumAuswahl)).valueChanges();
    console.log(query);*/


  }

  goToCreatPage(raum) {
    this.dataService.setData(1, raum);
    this.router.navigateByUrl('/create-meeting/1');
  }

  //Läd den momentanen Stand neu --> Liste oder Map aktualisieren sich 
  async reload() {
    var actualDate = new Date();
    var deleteArray2 = [];
    console.log(actualDate);
    var sortedMeetimgRef = this.db.collection('/meetings/', ref => ref.orderBy('dateAndTimeEnd', 'asc')).valueChanges();
    sortedMeetimgRef.forEach(function(document) {
      for (var i = 0; i < document.length; i++) {
        var meetingEndTime = new Date(document[i]['dateAndTimeEnd']);
        if (meetingEndTime < actualDate) {
          deleteArray2.push(document[i]['id']);
          console.log(deleteArray2);
        }
      }
    });

    await delay(5000);
    console.log(deleteArray2);
    for (var o = 0; o < deleteArray2.length; o++) {
      this.meetingCollectionRef.doc(deleteArray2[o]).delete().then(function() {
        console.log('Document successfully deleted!');
      }).catch(function(error) {
        console.error('Error removing document: ', error);
      });
    }

    //löschen alter Meetings
    this.query = this.db.collection('/meetings/', ref => ref.limit(3)).valueChanges();
    console.log(this.query);
    this.query.forEach((element) => {
      console.log(element);
    });


  }
}
