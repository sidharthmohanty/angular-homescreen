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
  mainData;
  constructor(private eventEmitterService: EventEmitterService) {}

  ngOnInit(): void {
    this.eventEmitterService.getData().subscribe((data) => {
      this.mainData = data;
      this.toggleData = this.mainData[0].toggleData;
      this.greetCheck = this.toggleData.greetings;
      this.questionCheck = this.toggleData.question;
      this.quoteCheck = this.toggleData.quote;
      this.dataAndTimeCheck = this.toggleData.dataAndTime;
      this.tempAndLocationCheck = this.toggleData.tempAndLocation;
    });
  }

  onToggleData(val) {
    this.eventEmitterService.getToggleData(val);
  }
}
