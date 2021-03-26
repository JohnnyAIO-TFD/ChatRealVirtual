import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { AlertService } from './alert.service';
import { AlertType } from './../enums/alert-type.enum';
import { Alert } from './../classes/alert';
import { User } from './../classes/user';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUser: Observable<User | null | undefined>;
  public currentUserSnapshot: User | null | undefined;

  constructor(private router: Router, 
    private alertService: AlertService,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore) {
    this.currentUser = this.afAuth.authState.pipe(switchMap((user) => {
      if(user){
        return this.db.doc<User>(`users/${user.uid}`).valueChanges();
      }else{
        return of(null);
      }
    }));
    this.setCurrentUserSnapshot();
  }//end-constructor

  public signup(firstName: string, lastName: string, email : string, password: string): Observable<boolean>{
    return from(this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((user) => {
      const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${user.user?.uid}`);
      const updatedUser = {
        id: String(user.user?.uid),
        email: user.user?.email,
        firstName,
        lastName,
        photoUrl: 'https://firebasestorage.googleapis.com/v0/b/chat-153ee.appspot.com/o/Default_Profile_Pick.jpg?alt=media&token=50006dff-4cf5-4296-8270-e8a5004bd959',
        quote: 'Nunca te rindas',
        bio: 'Software Engineer'
      };
      userRef.set(updatedUser);
      return true;
    })
    .catch((err) => false)
  );
  }//end-signup

  public login(email: string, password: string): Observable<boolean>{
    return from(this.afAuth.auth.signInWithEmailAndPassword(email, password).then((user) => true).catch((err) => false ));
  }//end-login

  public logout(): void{
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
      this.alertService.alerts.next(new Alert('Usted se encuentra desconectado', AlertType.Danger));
    })
  }//end-logout

  private setCurrentUserSnapshot(): void {
    this.currentUser.subscribe(user => this.currentUserSnapshot = user );
  }

}//end-service
