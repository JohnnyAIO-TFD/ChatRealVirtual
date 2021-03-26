import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Alert } from 'src/app/classes/alert';
import { AlertType } from 'src/app/enums/alert-type.enum';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AlertService} from './../../services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  public loginForm!: FormGroup;
  private subscriptions: Subscription[] = [];
  private returnUrl!: string;

  constructor(private fb: FormBuilder, 
    private alertService: AlertService, 
    private loadingService: LoadingService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.auth.currentUser.subscribe(user => {
        if(!!user){
          this.router.navigateByUrl('/chat');
        }
      })
    );
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/chat';
  }

  private createForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  public submit(): void {
    if(this.loginForm.valid){

      this.loadingService.isLoading.next(true);
      const {email, password} = this.loginForm?.value;
      this.subscriptions.push(
        this.auth.login(email, password).subscribe(success => {
          if(success){
            this.router.navigateByUrl(this.returnUrl);
          }else{
            this.displayFailedLogin();
          }
          this.loadingService.isLoading.next(false);
        })
      );
    }else{
      this.displayFailedLogin();
      this.loadingService.isLoading.next(false);
    }

  }//end-submit

  ngOnDestroy(){
    this.subscriptions.forEach(sub => sub.unsubscribe());

  }//end-OnDestroy

  private displayFailedLogin(): void{
    const failedLoginAlert = new Alert('Tu correo o contrasena es invalido, por favor intentalo nuevamente.', AlertType.Danger); 
    this.alertService.alerts.next(failedLoginAlert);
  }

}//end-class
