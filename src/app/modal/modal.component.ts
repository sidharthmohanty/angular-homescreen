import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EventEmitterService } from '../event-emitter.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalComponent implements OnInit {
  toggleData;
  greetCheck;
  questionCheck;
  quoteCheck;
  dataAndTimeCheck;
  tempAndLocationCheck;
  constructor(private eventEmitterService: EventEmitterService) {
    this.toggleData = this.eventEmitterService.getToggleData();
    this.greetCheck = this.toggleData.greetings;
    this.questionCheck = this.toggleData.question;
    this.quoteCheck = this.toggleData.quote;
    this.dataAndTimeCheck = this.toggleData.dataAndTime;
    this.tempAndLocationCheck = this.toggleData.tempAndLocation;
  }

  ngOnInit(): void {}

  toggleGreetings() {
    this.toggleData.greetings = false;
    this.eventEmitterService.sendClickEvent('greetings');
    console.log(this.toggleData);
  }
  toggleQuestion() {
    this.toggleData.question = false;
    this.eventEmitterService.sendClickEvent('question');
  }
  toggleQuote() {
    this.toggleData.quote = false;
    this.eventEmitterService.sendClickEvent('quote');
  }
  toggleDateAndTime() {
    this.toggleData.dataAndTime = false;
    this.eventEmitterService.sendClickEvent('dataAndTime');
  }
  toggleTempAndLocation() {
    this.toggleData.tempAndLocation = false;
    this.eventEmitterService.sendClickEvent('tempAndLocation');
  }
}
