import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalComponent implements OnInit {
  toggleData;
  greetings;
  question;
  quote;
  dateAndTime;
  tempAndLocation;
  data;
  admin;
  role;
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
            this.ui = true;
            this.dataService.getData(user.uid).subscribe((item) => {
              this.role = item.payload.doc.data()['role'];
              if (this.role === 'user') {
                this.data = item.payload.doc.data();
                this.toggleData = this.data.toggleData;
                this.greetings = this.toggleData.greetings;
                this.dateAndTime = this.toggleData.dateAndTime;
                this.question = this.toggleData.question;
                this.tempAndLocation = this.toggleData.tempAndLocation;
                this.quote = this.toggleData.quote;
              } else {
                this.dataService.getAdmin().subscribe((el) => {
                  this.data = el[0].payload.doc.data();
                  this.toggleData = this.data.toggleData;
                  this.greetings = this.toggleData.greetings;
                  this.dateAndTime = this.toggleData.dateAndTime;
                  this.question = this.toggleData.question;
                  this.tempAndLocation = this.toggleData.tempAndLocation;
                  this.quote = this.toggleData.quote;
                  this.admin = true;
                });
              }
            });
          } else {
            this.ui = false;
            this.dataService.getAdmin().subscribe((el) => {
              this.data = el[0].payload.doc.data();
              this.toggleData = this.data.toggleData;
              this.greetings = this.toggleData.greetings;
              this.dateAndTime = this.toggleData.dateAndTime;
              this.question = this.toggleData.question;
              this.tempAndLocation = this.toggleData.tempAndLocation;
              this.quote = this.toggleData.quote;
            });
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
            this.data.toggleData[val] = !this.data.toggleData[val];
            if (this.role === 'user') {
              this.dataService.updateData(this.data.id, this.data);
            } else {
              this.dataService.updateAdmin(this.data.id, this.data);
            }
          } else {
            this.dataService.localDataToggle(val);
          }
        })
      )
      .subscribe();
  }
}
