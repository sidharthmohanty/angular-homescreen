import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { EventEmitterService } from '../event-emitter.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

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

  questionLabel;
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
  fscreen;
  greetingLabel;
  data;
  name;
  quoteLabel;
  imgSrc;
  greetings;
  dataAndTime;
  question;
  tempAndLocation;
  quote;
  selectedImage;
  imageList;
  backgroundImage;

  formTemplate = new FormGroup({
    imageUrl: new FormControl('', Validators.required),
  });

  constructor(
    public storage: AngularFireStorage,
    @Inject(DOCUMENT) private document: any,
    public dialog: MatDialog,
    private eventEmitterService: EventEmitterService
  ) {
    setInterval(() => {
      this.now = Date.now();
    }, 1);
  }
  elem;
  ngOnInit() {
    // this.eventEmitterService.getImageList().subscribe((list) => {
    //   this.imageList = list;
    //   this.backgroundImage = this.imageList[this.imageList.length - 1].imageUrl;
    // });
    this.resetForm();
    this.eventEmitterService.getData().subscribe((items) => {
      this.data = items[0];
      this.toggleData = this.data.toggleData;
      this.name = this.data.name;
      this.questionLabel = this.data.questionLabel;
      this.quoteLabel = this.data.quoteLabel;
      this.greetings = this.toggleData.greetings;
      this.dataAndTime = this.toggleData.dataAndTime;
      this.question = this.toggleData.question;
      this.tempAndLocation = this.toggleData.tempAndLocation;
      this.quote = this.toggleData.quote;
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

    // this.eventEmitterService.toggleData.subscribe((response) => {
    //   this.toggleData = response;
    //   this.greetCheck = this.toggleData.greetings;
    //   this.questionCheck = this.toggleData.question;
    //   this.quoteCheck = this.toggleData.quote;
    //   this.dataAndTimeCheck = this.toggleData.dataAndTime;
    //   this.tempAndLocationCheck = this.toggleData.tempAndLocation;
    // });

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
              this.eventEmitterService.insertImage(formValue);
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
}
