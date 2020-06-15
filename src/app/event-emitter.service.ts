import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventEmitterService {
  toggle = {
    greetings: true,
    question: true,
    quote: true,
    dataAndTime: true,
    tempAndLocation: true,
  };
  private subject = new Subject<any>();
  sendClickEvent(tag) {
    this.updateToggleData(tag);
    this.subject.next();
  }
  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }
  getToggleData() {
    return this.toggle;
  }
  updateToggleData(tag) {
    this.toggle[tag] = false;
  }
}
