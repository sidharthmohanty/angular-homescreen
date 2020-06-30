import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class EventEmitterService {
  imageList: AngularFirestoreCollection<any>;
  toggleSubject = new Subject();
  toggleData = this.toggleSubject.asObservable();

  weatherKey = '13a39e79ccfa4247489d476c1408f52d';
  url =
    'http://api.openweathermap.org/data/2.5/weather?q=bhubaneswar&appid=13a39e79ccfa4247489d476c1408f52d&units=metric';
  toggle = {};

  constructor(private http: HttpClient, public db: AngularFirestore) {}
  getImage() {
    return this.db.collection('imagelist').valueChanges();
  }

  insertImage(image) {
    this.imageList.add(image);
  }
  getData() {
    return this.db.collection('1').valueChanges();
  }

  getToggleData(para) {
    this.toggle[para] = !this.toggle[para];
    this.toggleSubject.next(this.toggle);
  }

  getWeather() {
    return this.http.get(this.url);
  }
}
