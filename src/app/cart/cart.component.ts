import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  productss: Product[] = [];
  cart: Product[] = [];
  userId: string | null = null;
  wishCount: number = 0;
  cartCount: number = 0;
  couponCode: string = '';
  discount: number = 0;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (!this.userId) {
      console.error('No user is logged in');
      this.router.navigate(['/login']);
    } else {
      this.fetchProducts();
      this.loadCart();
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
  fetchProducts(): void {
    this.http.get<Product[]>('https://fakestoreapi.com/products').subscribe(
      (response) => {
        console.log('API Response:', response);
        this.productss = response.map(product => ({
          ...product,
          quantity: 1
        }));
        console.log('Mapped Products:', this.productss);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
  

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

  updateCart(): void {
    if (!this.userId) return;
    this.cart = [];
    localStorage.removeItem(`cart_${this.userId}`);
    this.cartCount = 0;
    console.log('Cart cleared:', this.cart);
  }
  

  updateQuantityFromInput(product: any, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const newQuantity = +inputElement.value;
  
    if (newQuantity < 1) {
      product.quantity = 1; 
    } else {
      product.quantity = newQuantity;
    }
  
    this.saveCart();
  }


applyCoupon(): void {
  const validCoupons: Record<string, number> = {
    'SAVE10': 10, 
    'SAVE20': 20,   
  };

  const discountPercentage = validCoupons[this.couponCode.toUpperCase()];
  if (discountPercentage !== undefined) {
    this.discount = (this.getTotalPrice() * discountPercentage) / 100;
    Swal.fire({
      icon: 'success',
      text: `Coupon applied! You saved ${discountPercentage}%.`,
      showConfirmButton: true,
      timer: 3000
   });
  } else {
    this.discount = 0;
    Swal.fire({
      icon: 'error',
      text: 'Invalid coupon code.',
      showConfirmButton: true,
      timer: 3000
   });
  }
}

getFinalPrice(): number {
  return this.getTotalPrice() - this.discount; 
}

getTotalPrice(): number {
  return this.cart.reduce((acc, product) => {
    const price = product.price ?? 0; 
    const quantity = product.quantity ?? 1; 
    return acc + (price * quantity);
  }, 0);
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
}
