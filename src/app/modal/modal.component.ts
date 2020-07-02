import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { tap } from 'rxjs/operators';
import { pipe } from 'rxjs';

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
  data;
  ui;
  constructor(
    public dataService: DataService,
    public auth: AuthService,
    public afAuth: AngularFireAuth
  ) {}
  ngOnInit() {
    this.auth
      .isLoggedIn()
      .pipe(
        tap((user) => {
          if (user) {
            this.dataService.getData(user.uid).subscribe((item) => {
              this.data = item.payload.doc.data();
              this.toggleData = this.data.toggleData;
              this.greetCheck = this.toggleData.greetings;
              this.questionCheck = this.toggleData.question;
              this.quoteCheck = this.toggleData.quote;
              this.dataAndTimeCheck = this.toggleData.dataAndTime;
              this.tempAndLocationCheck = this.toggleData.tempAndLocation;
            });
          } else {
            this.toggleData = this.dataService.toggleDataSource;
            console.log(this.toggleData);
            this.greetCheck = this.toggleData.greetings;
            this.questionCheck = this.toggleData.question;
            this.quoteCheck = this.toggleData.quote;
            this.dataAndTimeCheck = this.toggleData.dataAndTime;
            this.tempAndLocationCheck = this.toggleData.tempAndLocation;
          }
        })
      )
      .subscribe();
  }

  toggle(val) {
    this.auth
      .isLoggedIn()
      .pipe(
        tap((user) => {
          if (user) {
            this.onToggleData(val);
          } else {
            this.dataService.localDataToggle(val);
          }
        })
      )
      .subscribe();
  }

  onToggleData(val) {
    this.data.toggleData[val] = !this.data.toggleData[val];
    this.dataService.updateData(this.data.id, this.data);
  }
}
