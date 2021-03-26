import { Component, OnDestroy, OnInit} from '@angular/core';
import { AlertService } from './services/alert.service';
import { Alert } from './classes/alert';
import {LoadingService} from './services/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] =[];
  public alerts: Array<Alert> = [];
  public loading: boolean = false;
  
  title = 'chat-real';

  constructor(private AlertService: AlertService, private loadingService: LoadingService){  }

  ngOnInit(){
    this.subscriptions.push(this.AlertService.alerts.subscribe(alert => {
      console.log('alerta:', alert.text);
      this.alerts.push(alert);
    })
    )

    this.subscriptions.push(this.loadingService.isLoading.subscribe(isLoading => {
      this.loading = isLoading;
    })
    )
  }//end-ngOnInit

  ngOnDestroy(){
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
