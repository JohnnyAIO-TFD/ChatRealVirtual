import { Component, OnInit, OnDestroy} from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { finalize } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user';
import { AlertService } from '../../../app/services/alert.service';
import { Alert } from 'src/app/classes/alert';
import { AlertType } from 'src/app/enums/alert-type.enum';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy {

  public currentUser: any = null;
  public userId!: string | null;
  public subscriptions: Subscription[] = [];
  public uploadPercent!: number | null;
  public downloadUrl: any;

  constructor(
    private auth: AuthService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private fs: AngularFireStorage,
    private db: AngularFirestore,
    private location: Location,
    private alertService: AlertService
  ) { 
    this.loadingService.isLoading.next(true);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.auth.currentUser.subscribe(user => {
        this.currentUser = user;
        this.loadingService.isLoading.next(false);
      })
    );
    this.subscriptions.push(
      this.route.paramMap.subscribe(params => {
        this.userId = params.get('userId');
      })
    );
  }

  public uploadFile(event: any): void{
    const file = event.target.files[0];
    console.log(file);
    const filePath = `${file.name}`;
    console.log(filePath);
    const fileRef = this.fs.ref(filePath);
    console.log(fileRef);
    const task = this.fs.upload(filePath, file);
    console.log(task);
    // Observe the percentage changes
    this.subscriptions.push(
      task.percentageChanges().subscribe(percentage => {
        if(percentage! < 100){
          this.loadingService.isLoading.next(true);
        }else{
          this.loadingService.isLoading.next(false);
        }
        this.uploadPercent = percentage!;
      })
    );
    // get notified whe the download URL is available
    this.subscriptions.push( 
      task.snapshotChanges().pipe(finalize( () => { fileRef.getDownloadURL().subscribe(url => {
        // console.log(url);
        this.downloadUrl = url;
      }); })
      ).subscribe()
    );
  }

  public save(): void {
    let photo;
    if(this.downloadUrl){
      photo = this.downloadUrl;
      
    }else{
      photo = this.currentUser.photoUrl;
    }
    const user = Object.assign({}, this.currentUser, {photoUrl: photo});
    const userRef: AngularFirestoreDocument<User> = this.db.doc<User>(`users/${user.id}`);
    userRef.set({... user});
    this.alertService.alerts.next(new Alert('Tu perfil ha sido actualizado', AlertType.Success));
    this.location.back();
  }

  ngOnDestroy(){
    this.subscriptions.forEach(sub => sub.unsubscribe);
  }

}
