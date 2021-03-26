import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Alert } from 'src/app/classes/alert';
import { AlertType } from 'src/app/enums/alert-type.enum';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AlertService} from './../../services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {


  public signupForm!: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder, 
    private alertService : AlertService, 
    private auth: AuthService,
    private loadingService: LoadingService,
    private router: Router) {
    this.createForm();
   }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private createForm(): void {
    this.signupForm = this.fb.group({
      firstName:['', [Validators.required]],
      lastName:['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  public submit(): void {
    if(this.signupForm.valid){
      const {firstName, lastName, email, password} = this.signupForm?.value;
      this.subscriptions.push(this.auth.signup(firstName, lastName, email, password).subscribe(success => {
        if(success){
          this.router.navigate(['/chat']);
        }else{
          const failedSignedAlert = new Alert('Hay un problema de conexion, intentalo nuevamente', AlertType.Danger);
          this.alertService.alerts.next(failedSignedAlert);
        }
        this.loadingService.isLoading.next(false);
      })
      );
    }else{
    const failedSignedAlert = new Alert('Ingrese un nombre, apellido, correo y password nuevamente', AlertType.Danger);
    this.alertService.alerts.next(failedSignedAlert);
    }

  }

}//end-class
