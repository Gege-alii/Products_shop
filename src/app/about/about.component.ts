import { Component , OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {

  username: string | null = '';
  wishCount: number = 0;
  cartCount: number = 0;

  userId: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

 
  ngOnInit(): void {
    this.username = localStorage.getItem('username'); 
    console.log('Username retrieved:', this.username); 



    this.userId = this.authService.getUserId();
    if (!this.userId) {
      console.error('No user is logged in');
      this.router.navigate(['/login']);
    } else {
      this.updateCartCount();
      this.updateWishCount();
    }
  }

  

  updateWishCount(): void {
    if (this.userId) {
      const wish = localStorage.getItem(`wish_${this.userId}`);
      this.wishCount = wish ? JSON.parse(wish).length : 0;
    }
  } 

  
updateCartCount(): void {
  if (this.userId) {
    const cart = localStorage.getItem(`cart_${this.userId}`);
    this.cartCount = cart ? JSON.parse(cart).length : 0;
  }
}

logout(): void {
  this.authService.logout(); 
}

}
