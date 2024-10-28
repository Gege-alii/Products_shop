import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';


interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

@Component({
  selector: 'app-allproducts',
  templateUrl: './allproducts.component.html',
  styleUrls: ['./allproducts.component.css']
})
export class AllproductsComponent {

  products: any[] = [];
 
  bestproducts: any[] = [];
  cartCount: number = 0;
  wishCount: number = 0;
  searchQuery: string = '';
 
  cart: Product[] = [];

  productswish: Product[] = [];
    wish: Product[] = [];
  
  userId: string | null = null;
  filteredProducts: any[] = [];

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.http.get('https://fakestoreapi.com/products').subscribe((data: any) => {
      this.products = data;
      this.filteredProducts = data;
    });

    this.userId = this.authService.getUserId();
    if (!this.userId) {
      console.error('No user is logged in');
      this.router.navigate(['/login']);
    } else {
      this.loadCart();
      this.updateCartCount();
      this.updateWishCount();
    }


    this.userId = this.authService.getUserId();
    if (!this.userId) {
      console.error('No user is logged in');
      this.router.navigate(['/login']);
    } else {
      this.loadWish();
    }
  }
  filterProducts(): void {
    if (this.searchQuery) {
      this.filteredProducts = this.products.filter((product) =>
        product.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredProducts = this.products; 
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
  // Cart

 

  addToCart(product: Product): void {
    if (!this.userId) {
      console.error('No user is logged in');
      return;
    }

    const existingProduct = this.cart.find(p => p.id === product.id);
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      this.cart.push({ ...product });
    }
    this.cartCount = this.cart.length;
    Swal.fire({
      icon: 'success',
      title: 'Added to your Cart!',
      text: 'Your item has been added to the cart.',
      showConfirmButton: false,
      timer: 1500
   });
    this.saveCart();
    console.log('Cart after addition:', this.cart);
  }

  removeFromCart(productId: number): void {
    if (!this.userId) return;
    this.cart = this.cart.filter(product => product.id !== productId);
    this.saveCart();
    console.log('Cart after removal:', this.cart);
  }

  updateQuantity(product: Product, increase: boolean): void {
    if (increase) {
      product.quantity++;
    } else if (product.quantity > 1) {
      product.quantity--;
    }
    this.saveCart();
    console.log('Cart after quantity update:', this.cart);
  }


  loadCart(): void {
    if (!this.userId) return;
    const storedCart = localStorage.getItem(`cart_${this.userId}`);
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
      console.log('Loaded Cart:', this.cart);
    } else {
      console.log('No cart found for user:', this.userId);
    }
  }

  saveCart(): void {
    if (!this.userId) return;
    localStorage.setItem(`cart_${this.userId}`, JSON.stringify(this.cart));
    console.log('Cart saved:', this.cart);
  }

   // Wihlist

 

  addToWish(product: Product): void {
    if (!this.userId) {
      console.error('No user is logged in');
      return;
    }

    const existingProduct = this.wish.find(p => p.id === product.id);
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      this.wish.push({ ...product });
    }
    this.wishCount = this.wish.length;
    Swal.fire({
      icon: 'success',
      title: 'Added to your Wishlist!',
      text: 'Your item has been added to the wishlist.',
      showConfirmButton: false,
      timer: 1500
   });
    this.saveWish();
    console.log('Cart after addition:', this.wish);
  }

  removeFromWish(productId: number): void {
    if (!this.userId) return;
    this.wish = this.wish.filter(product => product.id !== productId);
    this.saveWish();
    console.log('Cart after removal:', this.wish);
  }

  updateQuantitywish(product: Product, increase: boolean): void {
    if (increase) {
      product.quantity++;
    } else if (product.quantity > 1) {
      product.quantity--;
    }
    this.saveWish();
    console.log('Cart after quantity update:', this.wish);
  }

 
  loadWish(): void {
    if (!this.userId) return;
    const storedCart = localStorage.getItem(`wish_${this.userId}`);
    if (storedCart) {
      this.wish = JSON.parse(storedCart);
      console.log('Loaded Cart:', this.wish);
    } else {
      console.log('No cart found for user:', this.userId);
    }
  }

  saveWish(): void {
    if (!this.userId) return;
    localStorage.setItem(`wish_${this.userId}`, JSON.stringify(this.wish));
    console.log('Cart saved:', this.wish);
  }

  viewProductDetails(productId: number): void {
    this.router.navigate(['/product', productId]); 
  }
}
