import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {}
  private isLoggedIn = false;
  private userId: string | null = null;

  login(email: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((user: any) => user.email === email);
    
    if (user && user.password === password) {
      this.isLoggedIn = true;
      this.userId = user.id; 
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userId', this.userId!); 
      localStorage.setItem('username', user.name);
      console.log('User logged in:', user.name);
      return true;
    }
    return false;
  }

  logout(): void {
    this.isLoggedIn = false;
    this.userId = null;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }

  getUserId(): string | null {
    return localStorage.getItem('userId'); 
  }

  isUserLoggedIn(): boolean {
    return this.isLoggedIn;
  }


  signUp(name: string, email: string, password: string) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser = {
        id: users.length + 1, 
        name,
        email,
        password,
        cart: [] 
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    console.log('User signed up:', newUser);
}

sendPasswordResetEmail(email: string): boolean {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((user: any) => user.email === email);

  if (user) {
    console.log(`Password reset email sent to: ${email}`);
    return true;
  } else {
    console.error('No user found with this email address.');
    return false;
  }
}

resetPassword(email: string, newPassword: string): boolean {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((user: any) => user.email === email);

  if (user) {
    user.password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Password has been reset for:', email);
    return true;
  } else {
    console.error('No user found with this email address.');
    return false;
  }
}

isEmailExists(email: string): boolean {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users.some((user: any) => user.email === email);
}


}