// error.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {
  errorMessage: string = 'Your visited page not found. You may go hame page';

  constructor( private authService: AuthService) {}

  logout(): void {
    this.authService.logout(); 
  }
}
