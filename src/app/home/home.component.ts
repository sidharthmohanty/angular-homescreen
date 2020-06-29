import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { EventEmitterService } from '../event-emitter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  clickEventsubscription: Subscription;

  public now: number;
  isDisplay = '';

  val = '';
  dtag = false;

  question = 'What is your main focus for today?';
  repeatQuestion = 'What is your main focus for today?';
  toggleData;
  greetCheck;
  questionCheck;
  quoteCheck;
  dataAndTimeCheck;
  tempAndLocationCheck;
  weather;
  city;
  clouds;
  sunny;
  temp;
  viewTemp;
  answer;
  lat;
  long;
  elem = document.documentElement;

  constructor(
    public dialog: MatDialog,
    private eventEmitterService: EventEmitterService
  ) {
    setInterval(() => {
      this.now = Date.now();
    }, 1);
  }
  ngOnInit() {
    this.eventEmitterService.toggleData.subscribe((response) => {
      this.toggleData = response;
      this.greetCheck = this.toggleData.greetings;
      this.questionCheck = this.toggleData.question;
      this.quoteCheck = this.toggleData.quote;
      this.dataAndTimeCheck = this.toggleData.dataAndTime;
      this.tempAndLocationCheck = this.toggleData.tempAndLocation;
    });
    this.eventEmitterService.getWeather().subscribe((data) => {
      this.weather = data;
      this.city = this.weather.name;
      this.temp = Math.floor(this.weather.main.temp);
      this.viewTemp = this.weather.weather[0].main;
      if (this.viewTemp === 'Clouds') {
        this.clouds = true;
        this.sunny = false;
      } else {
        console.log(this.weather.weather.main);
        this.clouds = false;
        this.sunny = true;
      }
    });
    this.toggleData = this.eventEmitterService.toggle;
    this.greetCheck = this.toggleData.greetings;
    this.questionCheck = this.toggleData.question;
    this.quoteCheck = this.toggleData.quote;
    this.dataAndTimeCheck = this.toggleData.dataAndTime;
    this.tempAndLocationCheck = this.toggleData.tempAndLocation;
  }

  getToggleValues() {
    this.toggleData = this.eventEmitterService.toggle;
    this.greetCheck = this.toggleData.greetings;
    this.questionCheck = this.toggleData.question;
    this.quoteCheck = this.toggleData.quote;
    this.dataAndTimeCheck = this.toggleData.dataAndTime;
    this.tempAndLocationCheck = this.toggleData.tempAndLocation;
  }
  getVal(item) {
    this.questionCheck = !this.questionCheck;
    this.answer = item.target.value;
    this.isDisplay = 'visibility:hidden';
    item.target.value = '';
  }

  toggleInput() {
    this.answer = '';
    this.isDisplay = '';
    this.dtag = false;
    this.questionCheck = !this.questionCheck;
    this.question = 'What is your main focus for today?';
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    this.dialog.open(ModalComponent, dialogConfig);
  }
  toggleClose() {
    this.dtag = true;
  }
  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    }
  }
}
