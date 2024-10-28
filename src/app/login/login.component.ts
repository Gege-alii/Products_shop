import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const user = users.find((user: any) => user.email === this.email);
    
    if (user) {
        if (this.authService.login(this.email, this.password)) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userId', user.email); 
            localStorage.setItem('userCart', JSON.stringify(user.cart || []));
            this.router.navigate(['/home']);
        } else {
            this.errorMessage = 'Invalid email or password.';
        }
    } else {
        this.errorMessage = 'User not found. Please sign up first.';
    }
  }
}
