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
  items: Observable<any>;
  itemsRef: AngularFirestoreCollection<any>;

  toggleSubject = new Subject();
  toggleData = this.toggleSubject.asObservable();
  url =
    'http://api.openweathermap.org/data/2.5/weather?q=bhubaneswar&appid=13a39e79ccfa4247489d476c1408f52d&units=metric';
  toggle = {};

  constructor(private http: HttpClient, public db: AngularFirestore) {
    this.itemsRef = db.collection('1');
    this.items = this.itemsRef.snapshotChanges();
  }
  getImage() {
    return this.db.collection('imagelist').valueChanges();
  }
  updateImage(id, data) {
    this.db.doc(`1/${id}`).update(data);
  }

  insertImage(image) {
    this.itemsRef.ref;
    this.itemsRef.add(image);
  }
  getData() {
    return this.db.collection('1').snapshotChanges();
  }

  getToggleData(para) {
    this.toggle[para] = !this.toggle[para];
    this.toggleSubject.next(this.toggle);
  }

  getWeather() {
    return this.http.get(this.url);
  }
}
