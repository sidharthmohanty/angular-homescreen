import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { DataService } from '../data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { finalize, first, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild('que') que;
  @ViewChild('quo') quo;

  uploadProgress: Observable<number>;
  task: AngularFireUploadTask;

  answerLabel: string;
  id: string;
  imageUrl: string;
  name: string;
  questionLabel;
  quoteLabel;
  toggleData;
  tempAndLocation;
  quote;
  dateAndTime;
  greetings;
  question;
  email: string;
  profilePhotoURL: string;
  ubar = false;
  saveBtn = false;
  quoSaveBtn = false;
  queSaveBtn = false;

  now: number;
  isDisplay = '';

  val = '';
  dtag = false;

  weather;
  city;
  clouds;
  sunny;
  temp;
  viewTemp;
  answer;
  lat;
  long;
  fscreen;
  greetingLabel;
  dataArray;
  data;
  imgSrc;
  selectedImage;
  imageList;
  backgroundImage;
  url;
  ui = true;
  elem = this.document.documentElement;
  subBtn = true;
  canBtn = true;
  inpField = true;
  role;

  formTemplate = new FormGroup({
    imageUrl: new FormControl('', Validators.required),
  });

  constructor(
    public auth: AuthService,
    private afAuth: AngularFireAuth,
    public storage: AngularFireStorage,
    @Inject(DOCUMENT) private document: any,
    public dialog: MatDialog,
    private dataService: DataService
  ) {
    setInterval(() => {
      this.now = Date.now();
    }, 1);
  }
  ngOnInit() {
    this.resetForm();
    this.auth
      .isLoggedIn()
      .pipe(
        tap((user) => {
          if (user) {
            this.ui = true;
            this.dataService.getData(user.uid).subscribe((item) => {
              this.role = item.payload.doc.data()['role'];
              this.name = item.payload.doc.data()['name'];
              if (this.role === 'user') {
                this.data = item.payload.doc.data();
                this.toggleData = this.data.toggleData;
                this.name = this.data.name;
                this.answerLabel = this.data.answerLabel;
                this.questionLabel = this.data.questionLabel;
                this.quoteLabel = this.data.quoteLabel;
                this.greetings = this.toggleData.greetings;
                this.dateAndTime = this.toggleData.dateAndTime;
                this.question = this.toggleData.question;
                this.tempAndLocation = this.toggleData.tempAndLocation;
                this.quote = this.toggleData.quote;
                this.url = this.data.imageUrl.replace(/['"]+/g, '');
                this.document.body.style.backgroundImage = `url(${this.url})`;
                if (this.answerLabel) {
                  this.question = false;
                }
              } else {
                this.dataService.getAdmin().subscribe((el) => {
                  this.data = el[0].payload.doc.data();
                  this.toggleData = this.data.toggleData;
                  this.answerLabel = this.data.answerLabel;
                  this.questionLabel = this.data.questionLabel;
                  this.quoteLabel = this.data.quoteLabel;
                  this.greetings = this.toggleData.greetings;
                  this.dateAndTime = this.toggleData.dateAndTime;
                  this.question = this.toggleData.question;
                  this.tempAndLocation = this.toggleData.tempAndLocation;
                  this.quote = this.toggleData.quote;
                  this.url = this.data.imageUrl.replace(/['"]+/g, '');
                  this.document.body.style.backgroundImage = `url(${this.url})`;
                  if (this.answerLabel) {
                    this.question = false;
                  }
                });
              }
            });
          } else {
            this.ui = false;
            this.dataService.getAdmin().subscribe((el) => {
              this.data = el[0].payload.doc.data();
              this.toggleData = this.data.toggleData;
              this.answerLabel = this.data.answerLabel;
              this.questionLabel = this.data.questionLabel;
              this.quoteLabel = this.data.quoteLabel;
              this.greetings = this.toggleData.greetings;
              this.dateAndTime = this.toggleData.dateAndTime;
              this.question = this.toggleData.question;
              this.tempAndLocation = this.toggleData.tempAndLocation;
              this.quote = this.toggleData.quote;
              this.url = this.data.imageUrl.replace(/['"]+/g, '');
              this.document.body.style.backgroundImage = `url(${this.url})`;
              if (this.answerLabel) {
                this.question = false;
              }
            });
          }
        })
      )
      .subscribe();
    this.dataService.toggleData.subscribe((response) => {
      this.toggleData = response;
      this.greetings = this.toggleData.greetings;
      this.question = this.toggleData.question;
      this.quote = this.toggleData.quote;
      this.dateAndTime = this.toggleData.dateAndTime;
      this.tempAndLocation = this.toggleData.tempAndLocation;
    });

    const time = new Date().getHours();
    if (time < 10) {
      this.greetingLabel = 'morning';
    } else if (time < 17) {
      this.greetingLabel = 'day';
    } else {
      this.greetingLabel = 'evening';
    }
    if (!document.fullscreenElement) {
      this.fscreen = true;
    } else {
      this.fscreen = false;
    }

    this.dataService.getWeather().subscribe((data) => {
      this.weather = data;
      this.city = this.weather.name;
      this.temp = Math.floor(this.weather.main.temp);
      this.viewTemp = this.weather.weather[0].main;
      if (this.viewTemp === 'Clouds') {
        this.clouds = true;
        this.sunny = false;
      } else {
        this.clouds = false;
        this.sunny = true;
      }
    });
  }
  // getBackurl() {
  //   return this.data.imageUrl;
  // }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    this.dialog.open(ModalComponent, dialogConfig);
  }

  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.fscreen = !this.fscreen;
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      this.fscreen = !this.fscreen;

      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      this.fscreen = !this.fscreen;

      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      this.fscreen = !this.fscreen;

      this.elem.msRequestFullscreen();
    }
  }
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.fscreen = !this.fscreen;
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      this.fscreen = !this.fscreen;

      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      this.fscreen = !this.fscreen;

      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      this.fscreen = !this.fscreen;

      this.document.msExitFullscreen();
    }
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  // @HostListener('window:keydown', ['$event'])
  // keyEvent(event) {
  //   if (event.keyCode === 27) {
  //     console.log(window.innerHeight);
  //     console.log(screen.height);
  //   }
  // }

  uploadImage(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => (this.imgSrc = e.target.result);
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
      this.subBtn = !this.subBtn;
    } else {
      this.imgSrc = '';
      this.selectedImage = null;
      this.subBtn = !this.subBtn;
    }
  }

  onSubmit(formValue) {
    if (this.formTemplate.valid) {
      this.auth.isLoggedIn().pipe(
        tap((user) => {
          if (user) {
            this.ubar = !this.ubar;
            const filePath = `images/${
              this.selectedImage.name
            }_${new Date().getTime()}`;
            const fileRef = this.storage.ref(filePath);
            this.task = this.storage.upload(filePath, this.selectedImage);
            this.uploadProgress = this.task.percentageChanges();
            this.inpField = !this.inpField;
            this.subBtn = !this.subBtn;
            this.canBtn = !this.canBtn;
            if (this.role === 'user') {
              this.task
                .snapshotChanges()
                .pipe(
                  finalize(() => {
                    fileRef.getDownloadURL().subscribe((url) => {
                      formValue.imageUrl = url;
                      this.data.imageUrl = url;
                      this.dataService.updateData(this.data.id, this.data);
                      this.resetForm();
                      this.ubar = !this.ubar;
                    });
                  })
                )
                .subscribe();
            } else {
              this.task
                .snapshotChanges()
                .pipe(
                  finalize(() => {
                    fileRef.getDownloadURL().subscribe((url) => {
                      formValue.imageUrl = url;
                      this.data.imageUrl = url;
                      this.dataService.updateAdmin(this.data.id, this.data);
                      this.resetForm();
                      this.ubar = !this.ubar;
                    });
                  })
                )
                .subscribe();
            }
          } else {
            console.log('You are not logged in');
          }
        })
      );
    } else {
      console.log('not valid');
    }
  }
  handleUpload(event) {
    console.log(event.target);
  }

  cancel() {
    this.task.cancel();
    this.resetForm();
    this.canBtn = !this.canBtn;
  }
  resetForm() {
    this.formTemplate.reset();
  }

  updateAns(event) {
    this.auth
      .isLoggedIn()
      .pipe(
        tap((user) => {
          this.answerLabel = event.target.value;
          this.dtag = !this.dtag;
          if (user) {
            if (this.role === 'user') {
              this.data.answerLabel = event.target.value;
              this.dataService.updateData(this.data.id, this.data);
            } else {
              this.data.answerLabel = event.target.value;
              this.dataService.updateAdmin(this.data.id, this.data);
            }
          } else {
            this.question = !this.question;
          }
        })
      )
      .subscribe();
  }
  deleteAns() {
    this.dtag = false;
    this.auth
      .isLoggedIn()
      .pipe(
        tap((user) => {
          if (user) {
            this.data.answerLabel = '';
            if (this.role === 'user') {
              this.dataService.updateData(this.data.id, this.data);
            } else {
              this.dataService.updateAdmin(this.data.id, this.data);
            }
          } else {
            this.answerLabel = '';
            this.question = !this.question;
          }
        })
      )
      .subscribe();
  }
  toggleSaveQue() {
    this.queSaveBtn = true;
  }
  toggleSaveQuo() {
    this.quoSaveBtn = true;
  }
  updateQuestion() {
    this.auth
      .isLoggedIn()
      .pipe(
        tap((user) => {
          this.questionLabel = this.que.nativeElement.innerText;
          if (user) {
            this.data.questionLabel = this.que.nativeElement.innerText;
            if (this.role === 'user') {
              this.dataService.updateData(this.data.id, this.data);
            } else {
              this.dataService.updateAdmin(this.data.id, this.data);
            }
          }
        })
      )
      .subscribe();
    this.queSaveBtn = false;
  }
  updateQuote() {
    this.auth
      .isLoggedIn()
      .pipe(
        tap((user) => {
          this.quoteLabel = this.quo.nativeElement.innerText;
          if (user) {
            this.data.quoteLabel = this.quo.nativeElement.innerText;
            if (this.role === 'user') {
              this.dataService.updateData(this.data.id, this.data);
            } else {
              this.dataService.updateAdmin(this.data.id, this.data);
            }
          }
        })
      )
      .subscribe();
    this.quoSaveBtn = false;
  }
  cancelEdit() {
    this.quoSaveBtn = false;
    this.queSaveBtn = false;
  }
}
