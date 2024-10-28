import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  email: string = '';
  newPassword: string = '';
  isResetting: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  sendResetEmail(): void {
    if (!this.email) {
      Swal.fire({
        title: 'Error!',
        text: 'Email field cannot be empty.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!this.authService.isEmailExists(this.email)) {
      Swal.fire({
        title: 'Error!',
        text: 'Email not found.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return; 
    }

    this.authService.sendPasswordResetEmail(this.email);
    this.isResetting = true;
    Swal.fire({
      title: 'Success!',
      text: 'Password reset email sent.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  resetPassword(): void {
    if (!this.newPassword) {
      Swal.fire({
        title: 'Error!',
        text: 'New password field cannot be empty.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return; 
    }

    if (this.authService.resetPassword(this.email, this.newPassword)) {
      Swal.fire({
        title: 'Success!',
        text: 'Password has been reset successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/login']);
      });
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to reset password. Email not found.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
}
