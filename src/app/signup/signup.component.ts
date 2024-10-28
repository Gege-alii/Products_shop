import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  onSignup() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find((user: any) => user.email === this.email)) {
        this.errorMessage = 'Email already exists. Please log in.';
    } else {
        users.push({ name: this.name, email: this.email, password: this.password, cart: [] });
        localStorage.setItem('users', JSON.stringify(users));
        this.router.navigate(['/login']);
    }
  }
}
