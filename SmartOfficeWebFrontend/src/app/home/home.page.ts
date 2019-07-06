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

  raum1FlagFrei;
  raum2FlagFrei;
  raum3FlagFrei;
  raum1FlagReserviert;
  raum2FlagReserviert;
  raum3FlagReserviert;
  raum1FlagBelegt;
  raum2FlagBelegt;
  raum3FlagBelegt;

  roomCollectionRef: AngularFirestoreCollection<any>;
  roomRef: Observable<any>;

  constructor(
    private router: Router, private dataService: DataService, public db: AngularFirestore) {
      this.meetingCollectionRef = this.db.collection('meetings');
      this.meetingRef = this.meetingCollectionRef.valueChanges();
      this.roomCollectionRef = this.db.collection('rooms');
      this.roomRef = this.meetingCollectionRef.valueChanges();

      this.userID = this.dataService.getData(2);

      this.reload();

      this.query = this.db.collection('/meetings/', ref => ref.limit(3)).valueChanges();
      console.log(this.query);

      this.raum1FlagFrei = true;
      this.raum2FlagFrei = true;
      this.raum3FlagFrei = true;
      this.raum1FlagReserviert = false;
      this.raum2FlagReserviert = false;
      this.raum3FlagReserviert = false;
      this.raum1FlagBelegt = false;
      this.raum2FlagBelegt = false;
      this.raum3FlagBelegt = false;

      this.db.collection('rooms').valueChanges().forEach((room) => {
        for (var t = 0; t < room.length; t++){
          if (room[t]['name'] === 'Büro 1') {
            this.raum1FlagFrei = room[t]['frei'];
            this.raum1FlagReserviert = room[t]['reserviert'];
            this.raum1FlagBelegt = room[t]['belegt'];
          } else if (room[t]['name'] === 'Büro 2') {
            this.raum2FlagFrei = room[t]['frei'];
            this.raum2FlagReserviert = room[t]['reserviert'];
            this.raum2FlagBelegt = room[t]['belegt'];
          } else if (room[t]['name'] === 'Büro 3') {
            this.raum3FlagFrei = room[t]['frei'];
            this.raum3FlagReserviert = room[t]['reserviert'];
            this.raum3FlagBelegt = room[t]['belegt'];
          }
        }
      });
  }

  /**
   * Läd die Liste der Meetings nach.
   */
  update(){
    this.query = this.db.collection('/meetings/', ref => ref.limit(3)).valueChanges();
    this.reload();
  }

  /**
   * 
   * @param raum 
   * 
   * Verlinkt zur "Meeting erstellen"-Seite und übergibt den ausgewählten Raum
   * (aus der Übersichts-Map)
   */
  goToCreatPage(raum) {
    this.dataService.setData(1, raum);
    this.router.navigateByUrl('/create-meeting/1');
  }

  /**
   * Läd den momentanen Stand neu --> Liste oder Map aktualisieren sich 
   * & löscht alte Meetings
   */
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

    await delay(500);
    console.log(deleteArray2);
    for (var o = 0; o < deleteArray2.length; o++) {
      this.meetingCollectionRef.doc(deleteArray2[o]).delete().then(function() {
        console.log('Document successfully deleted!');
      }).catch(function(error) {
        console.error('Error removing document: ', error);
      });
    }
    this.query = this.db.collection('/meetings/', ref => ref.limit(3)).valueChanges();
    console.log(this.query);
    this.query.forEach((element) => {
      console.log(element);
      this.raum1FlagReserviert = false;
      this.raum2FlagReserviert = false;
      this.raum3FlagReserviert = false;
      for (var r = 0; r<element.length; r++) {
        if (element[r]['room'] === 'r1') {
          console.log('1: r1res = true');
          this.raum1FlagReserviert = true;
          console.log('1.5: ' + this.raum1FlagReserviert);
        } else if (element[r]['room'] === 'r2') {
          console.log('2: r2res = true');
          this.raum3FlagReserviert = true;
          console.log('2.5: ' + this.raum2FlagReserviert);
        } else if (element[r]['room'] === 'r3') {
          console.log('3: r3res = true');
          this.raum3FlagReserviert = true;
          console.log('3.5: ' + this.raum3FlagReserviert);
        }
      }
    });
    this.setRoomreserviert();
  }

  /**
   * setzt Räme auf den Status "reserviert" = true wenn ein Meeting zu diesem Zeitpunkt eingetragen ist
   */
  setRoomreserviert() {
    if (this.raum1FlagReserviert === false) {
      console.log('4.0: res:' + this.raum1FlagReserviert + 'fre: ' + this.raum1FlagFrei);
      this.raum1FlagFrei = true;
      console.log('4: r1res = false --> r1fre = true');

    }
    if (this.raum2FlagReserviert === false) {
      console.log('5.0: res:' + this.raum2FlagReserviert + 'fre: ' + this.raum2FlagFrei);
      this.raum2FlagFrei = true;
      console.log('5: r2res = false --> r2fre = true');
    }
    if (this.raum3FlagReserviert === false) {
      console.log('6.0: res:' + this.raum3FlagReserviert + 'fre: ' + this.raum3FlagFrei);
      this.raum3FlagFrei = true;
      console.log('6: r3res = false --> r3fre = true');
    }

    if (this.raum1FlagReserviert === true) {
      console.log('7.0: res:' + this.raum1FlagReserviert + 'fre: ' + this.raum1FlagFrei);
      this.raum1FlagFrei = false;
      console.log('7: r1res = true --> r1fre = false');
    }
    if (this.raum2FlagReserviert === true) {
      console.log('8.0: res:' + this.raum2FlagReserviert + 'fre: ' + this.raum2FlagFrei);
      this.raum2FlagFrei = false;
      console.log('8: r2res = true --> r2fre = false');

    }
    if (this.raum3FlagReserviert === true) {
      console.log('9.0: res:' + this.raum3FlagReserviert + 'fre: ' + this.raum3FlagFrei);
      this.raum3FlagFrei = false; 
      console.log('9: r3res = true --> r3fre = false');

    }

    console.log('10.1: res:' + this.raum1FlagReserviert + 'fre: ' + this.raum1FlagFrei);
    this.db.collection('rooms').doc('r1').update({
       reserviert: this.raum1FlagReserviert,
       frei: this.raum1FlagFrei
      });
    console.log('10.2: res:' + this.raum2FlagReserviert + 'fre: ' + this.raum2FlagFrei);
    this.db.collection('rooms').doc('r2').update({
      reserviert: this.raum2FlagReserviert,
      frei: this.raum2FlagFrei
    });
    console.log('10.3: res:' + this.raum3FlagReserviert + 'fre: ' + this.raum3FlagFrei);
    this.db.collection('rooms').doc('r3').update({
      reserviert: this.raum3FlagReserviert,
      frei: this.raum3FlagFrei
    });
    console.log('10: Update Räume fertig!')
  }
}
