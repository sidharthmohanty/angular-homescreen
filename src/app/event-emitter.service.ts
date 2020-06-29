import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EventEmitterService {
  toggleSubject = new Subject();
  toggleData = this.toggleSubject.asObservable();

  weatherKey = '13a39e79ccfa4247489d476c1408f52d';
  url =
    'http://api.openweathermap.org/data/2.5/weather?q=bhubaneswar&appid=13a39e79ccfa4247489d476c1408f52d&units=metric';
  toggle = {
    greetings: true,
    question: true,
    quote: true,
    dataAndTime: true,
    tempAndLocation: true,
  };

  constructor(private http: HttpClient) {}

  getToggleData(para) {
    this.toggle[para] = !this.toggle[para];
    this.toggleSubject.next(this.toggle);
  }

  getWeather() {
    return this.http.get(this.url);
  }
}
