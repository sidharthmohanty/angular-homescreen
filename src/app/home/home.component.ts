import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { DataService } from '../data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, first, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  answerLabel: string;
  id: string;
  imageUrl: string;
  name: string;
  questionLabel;
  quoteLabel;
  toggleData;
  tempAndLocation;
  quote;
  dataAndTime;
  greetings;
  question;
  email: string;
  profilePhotoURL: string;

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
              this.data = item.payload.doc.data();
              this.toggleData = this.data.toggleData;
              this.name = this.data.name;
              this.answerLabel = this.data.answerLabel;
              this.questionLabel = this.data.questionLabel;
              this.quoteLabel = this.data.quoteLabel;
              this.greetings = this.toggleData.greetings;
              this.dataAndTime = this.toggleData.dataAndTime;
              this.question = this.toggleData.question;
              this.tempAndLocation = this.toggleData.tempAndLocation;
              this.quote = this.toggleData.quote;
              this.url = this.data.imageUrl.replace(/['"]+/g, '');
              this.document.body.style.backgroundImage = `url(${this.url})`;
              if (this.answerLabel) {
                this.question = false;
              }
            });
          } else {
            this.ui = false;
            this.toggleData = this.dataService.toggleDataSource;
            this.name = '';
            this.answerLabel = '';
            this.questionLabel = 'What is your main focus for today?';
            this.quoteLabel =
              'Feelings are just visitors. Let them come and go';
            this.greetings = this.toggleData.greetings;
            this.dataAndTime = this.toggleData.dataAndTime;
            this.question = this.toggleData.question;
            this.tempAndLocation = this.toggleData.tempAndLocation;
            this.quote = this.toggleData.quote;
            this.document.body.style.backgroundImage =
              'url(https://firebasestorage.googleapis.com/v0/b/home-screen-b422f.appspot.com/o/images%2Fback2.jpg_1593577715597?alt=media&token=b3bce5fb-0e97-49e3-bfdf-65244b0fc74d)';
          }
        })
      )
      .subscribe();
    this.dataService.toggleData.subscribe((response) => {
      this.toggleData = response;
      this.greetings = this.toggleData.greetings;
      this.question = this.toggleData.question;
      this.quote = this.toggleData.quote;
      this.dataAndTime = this.toggleData.dataAndTime;
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

  toggleClose() {
    this.dtag = true;
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
  //     console.log('yeahhhh');
  //   }
  // }

  uploadImage(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => (this.imgSrc = e.target.result);
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    } else {
      this.imgSrc = '';
      this.selectedImage = null;
    }
  }

  onSubmit(formValue) {
    if (this.formTemplate.valid) {
      const filePath = `images/${
        this.selectedImage.name
      }_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage
        .upload(filePath, this.selectedImage)
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              formValue.imageUrl = url;
              this.data.imageUrl = url;
              this.dataService.updateData(this.data.id, this.data);
              // this.eventEmitterService.insertImage(formValue);
              this.resetForm();
            });
          })
        )
        .subscribe();
    }
  }
  resetForm() {
    this.formTemplate.reset();
  }
  updateAns(event) {
    this.data.answerLabel = event.target.value;
    this.dataService.updateData(this.data.id, this.data);
  }
  deleteAns() {
    this.dtag = false;
    this.data.answerLabel = '';
    this.dataService.updateData(this.data.id, this.data);
  }
}
