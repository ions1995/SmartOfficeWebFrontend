import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private router: Router, private dataService: DataService
  ) {}

  goToCreatPage(raum) {
    alert(raum);
    this.dataService.setData(1, raum);
    this.router.navigateByUrl('/create-meeting/1');
  }
}
