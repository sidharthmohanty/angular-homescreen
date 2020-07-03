import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { flatMap, first, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  toggleDataSource = {
    greetings: true,
    question: true,
    quote: true,
    dateAndTime: true,
    tempAndLocation: true,
  };

  items: Observable<any>;
  itemsRef: AngularFirestoreCollection<any>;

  toggleSubject = new Subject();
  toggleData = this.toggleSubject.asObservable();
  url =
    'http://api.openweathermap.org/data/2.5/weather?q=bhubaneswar&appid=13a39e79ccfa4247489d476c1408f52d&units=metric';

  constructor(
    private http: HttpClient,
    public db: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    this.itemsRef = db.collection('users');
    this.items = this.itemsRef.snapshotChanges();
  }

  updateData(id, data) {
    this.db.doc(`users/${id}`).update(data);
  }
  updateAdmin(id, data) {
    this.db.doc(`admin/${id}`).update(data);
  }

  getData(id) {
    return this.db
      .collection('users', (ref) => ref.where('id', '==', id).limit(1))
      .snapshotChanges()
      .pipe(flatMap((users) => users));
  }

  getAdmin() {
    return this.db.collection('admin').snapshotChanges();
  }

  getWeather() {
    return this.http.get(this.url);
  }

  localDataToggle(val) {
    this.toggleDataSource[val] = !this.toggleDataSource[val];

    this.toggleSubject.next(this.toggleDataSource);
  }
}
