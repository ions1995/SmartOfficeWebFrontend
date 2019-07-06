import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

import { DataService } from '../services/data.service';
import { delay } from 'q';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-create-meeting',
  templateUrl: './create-meeting.page.html',
  styleUrls: ['./create-meeting.page.scss'],
})
export class CreateMeetingPage implements OnInit {
  data: any;
  raumAuswahl;
  verpflichtendeEinladungen = [];
  optionaleEinladungen = [];
  dateFrom;
  dateTo;
  bewirtungsauswahl = [];
  username;
  user;

  flag: boolean = false;

  userCollectionRef: AngularFirestoreCollection<any>;
  userRef: Observable<any>;
  meetingCollectionRef: AngularFirestoreCollection<any>;
  meetingRef: Observable<any>;

  fehlermeldungString: string;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    public db: AngularFirestore,
    private dataService: DataService,
    public alertController: AlertController
  ) {
    this.userCollectionRef = this.db.collection('user');
    this.userRef = this.userCollectionRef.valueChanges();

    this.meetingCollectionRef = this.db.collection('meetings');
    this.meetingRef = this.meetingCollectionRef.valueChanges();
  }

  ngOnInit() {
    if (this.route.snapshot.data['special']) {
      this.data = this.route.snapshot.data['special'];
    }

    //Raum nach der Auswahl auf der Übersicht setzen
    this.raumAuswahl = this.dataService.getData(1);

    //Gastgeber setzen
    this.user = this.dataService.getData(2);
    this.userCollectionRef.doc(this.user.uid).valueChanges().forEach((user1) => {
      this.username = user1['username'];
    });
  }

  /**
   * prüfen der Eingaben
   **/
  async checkMeeting() {

    if (this.raumAuswahl === 'r1') {
      this.bewirtungsauswahl = [];
    }

    this.flag = false;
    let dateFrom = new Date(this.dateFrom);
    let dateTo = new Date(this.dateTo);

    var query = this.db.collection('/meetings/', ref => ref
      .where('room', '==', this.raumAuswahl)).valueChanges();

    var breakLoop = false;
    query.forEach(document => {
      if (!breakLoop) {
        if (dateFrom < new Date() || dateTo < new Date()) {
          breakLoop = true;
          this.fehlermeldungString = 'Sie haben ein Anfangsdatum oder ein Enddatum gewählt, das kleiner als das aktuelle Datum ist. Es ist nicht möglich Meetings in der Vergangenheit zu erstellen. Bitte beheben Sie diesen Fehler und versuchen Sie es erneut.';
        } else {
          if (dateTo < dateFrom && !breakLoop) {
            this.fehlermeldungString = 'Sie haben ein Anfangsdatum gewählt, daas größer als das Enddatum ist. Bitte beheben Sie diesen Fehler und versuchen Sie es erneut.';
            breakLoop = true;
          } else {
            if (document.length === 0 && !breakLoop) {
              this.flag = true;
              this.fehlermeldungString = 'Buchung kann vorgenommen werden.';
            } else {
              for (var i = 0; i < document.length; i++) {
                let dateFireFrom = new Date(document[i]['dateAndTimeStart']);
                let dateFireTo = new Date(document[i]['dateAndTimeEnd']);
                if (((dateFrom < dateFireFrom && dateTo <= dateFireFrom) || (dateFrom >= dateFireTo && dateTo > dateFireTo)) && !breakLoop) {
                  this.flag = true;
                  this.fehlermeldungString = 'Buchung kann vorgenommen werden.';
                } else {
                  this.fehlermeldungString = 'Fehler bei der Prüfung', 'Es kam zu einem unerwarteten Fehler bei der Prüfung. Bitte überprüfen Sie ihre EIngaben und versuchen Sie es erneut.';
                  breakLoop = true;
                }
              }
            }
          }
        }
      }
    });
  }

  /**
   * Eingeben prüfen und das Meeting anlegen falls es zu keinen anderen Fehlern kommt
   */
  async saveMeeting() {
    this.checkMeeting();
    await delay(5000);
    if (this.flag) {
      var idref = this.user.uid + this.raumAuswahl + this.dateTo;
      this.meetingCollectionRef.doc(idref).set({
        bewirtung: this.bewirtungsauswahl,
        dateAndTimeEnd: this.dateTo,
        dateAndTimeStart: this.dateFrom,
        hostID: this.user.uid,
        hostName: this.username,
        optional: this.optionaleEinladungen,
        verpflichtend: this.verpflichtendeEinladungen,
        room: this.raumAuswahl,
        id: idref
      }).then(function () {
        console.log("Document successfully written!");
      }).catch(function (error) {
        console.error("Error writing document: ", error);
      });
      this.navigateToHome();
    }
  }

  /**
   * Fehlerausgabe-Methode
   */
  async presentAlert(title: string, text: string) {
    const alert = await this.alertController.create({
      header: title,
      message: text,
      buttons: ['OK']
    });

    await alert.present();
  }

  /**
   * Methode um zurück zur Raumübersicht zu gelangen
   */
  navigateToHome() {
    this.navCtrl.navigateBack('/home');
  }

}
