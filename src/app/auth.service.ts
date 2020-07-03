import { Injectable } from '@angular/core';
import { User } from './user.model';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';
import { DataService } from './data.service';
import { Router } from '@angular/router';
import { HomeComponent } from './home/home.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User>;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private dataService: DataService
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        // Logged in
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    );
  }

  isLoggedIn() {
    return this.afAuth.authState.pipe(first());
  }
  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    window.location.reload();
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //   this.router.navigate(['HomeComponent']);
    // });
    return this.updateUserData(credential.user);
  }
  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );

    const data = {
      id: user.uid,
      answerLabel: '',
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/home-screen-b422f.appspot.com/o/images%2Fback3.jpg_1593752464204?alt=media&token=9cf1e477-5c13-4817-a53c-9ad98f84bc07',
      name: user.displayName,
      questionLabel: 'What is your main focus for today?',
      quoteLabel: 'Feelings are just visitors. Let them come and go',
      role: 'user',
      toggleData: {
        tempAndLocation: true,
        quote: true,
        dataAndTime: true,
        greetings: true,
        question: true,
      },
      imageName: 'back3.jpg_1593752464204',
      email: user.email,
      profilePhotoURL: user.photoURL,
    };

    return userRef.set(data, { merge: true });
  }

  async signOut() {
    await this.afAuth.signOut();
    window.location.reload();

    // this.router.navigate(['/']);
  }
}
