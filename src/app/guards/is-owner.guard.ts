import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertService } from '../../app/services/alert.service';
import { Alert } from '../../app/classes/alert';
import { AlertType} from '../../app/enums/alert-type.enum';
import { Router } from '@angular/router';
import { map, take, tap} from 'rxjs/operators';
import { AuthService } from '../../app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsOwnerGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertService: AlertService,


  ){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.currentUser.pipe(
      take(1), map((currentUser) => !!currentUser && currentUser.id === next.params.userId),
      tap((isOwner) => {
        if(!isOwner){
          this.alertService.alerts.next(new Alert('Solo puedes editar tu perfil', AlertType.Danger));
          this.router.navigate(['/login'], {queryParams: { returnUrl: state.url}});
        }
      })
    );
  }
  
}
