import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private data = [];

  constructor() { }

  setData(id, data) {
    this.data[id] = data;
    console.log(this.data[id]);
  }

  getData(id) {
    console.log(this.data[id]);
    return this.data[id];
  }
}
