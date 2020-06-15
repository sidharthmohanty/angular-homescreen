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

  constructor(
    public dialog: MatDialog,
    private eventEmitterService: EventEmitterService
  ) {
    this.clickEventsubscription = this.eventEmitterService
      .getClickEvent()
      .subscribe(() => {
        this.getToggleValues();
      });
    setInterval(() => {
      this.now = Date.now();
    }, 1);
    this.toggleData = this.eventEmitterService.getToggleData();
    this.greetCheck = this.toggleData.greetings;
    this.questionCheck = this.toggleData.question;
    this.quoteCheck = this.toggleData.quote;
    this.dataAndTimeCheck = this.toggleData.dataAndTime;
    this.tempAndLocationCheck = this.toggleData.tempAndLocation;
  }
  ngOnInit() {}
  getToggleValues() {
    this.toggleData = this.eventEmitterService.getToggleData();
    this.greetCheck = this.toggleData.greetings;
    this.questionCheck = this.toggleData.question;
    this.quoteCheck = this.toggleData.quote;
    this.dataAndTimeCheck = this.toggleData.dataAndTime;
    this.tempAndLocationCheck = this.toggleData.tempAndLocation;
  }
  getVal(item) {
    this.question = item.target.value;
    this.dtag = !this.dtag;
    this.isDisplay = 'visibility:hidden';
    item.target.value = '';
  }

  toggleInput() {
    this.isDisplay = '';
    this.dtag = !this.dtag;
    this.question = this.repeatQuestion;
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    this.dialog.open(ModalComponent, dialogConfig);
  }
}
