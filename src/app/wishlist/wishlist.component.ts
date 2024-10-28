import { Component , OnInit } from '@angular/core';
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
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})

export class WishlistComponent implements OnInit {

    productswish: Product[] = [];
    productss: Product[] = [];
    wish: Product[] = [];
    userId: string | null = null;
    products: any[] = [];
    wishCount: number = 0;
    cartCount: number = 0;
   
    cart: Product[] = [];
  
    constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}
  
    ngOnInit(): void {

      this.http.get("https://fakestoreapi.com/products?limit=4").subscribe((data: any) => {
        this.products = data;
      });

      this.userId = this.authService.getUserId();
      if (!this.userId) {
        console.error('No user is logged in');
        this.router.navigate(['/login']);
      } else {
        this.fetchProducts();
        this.loadWish();
        this.updateCartCount();
      this.updateWishCount();
      }

      this.userId = this.authService.getUserId();
      if (!this.userId) {
        console.error('No user is logged in');
        this.router.navigate(['/login']);
      } else {
        this.loadCart();
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
          this.productswish = response.map(product => ({
            ...product,
            quantity: 1
          }));
          console.log('Mapped Products:', this.productswish);
        },
        (error) => {
          console.error('Error fetching products:', error);
        }
      );
    }
  
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
      console.log('Wish after addition:', this.wish);
    }

    updateWish(): void {
      if (!this.userId) return;
      const storedWishlist = localStorage.getItem(`wish_${this.userId}`);
      const wishlist: Product[] = storedWishlist ? JSON.parse(storedWishlist) : [];
      wishlist.forEach(wishItem => {
        const isInCart = this.cart.some(cartItem => cartItem.id === wishItem.id);
        if (!isInCart) {
          this.cart.push({ ...wishItem });
        }
      });
      this.saveCart();
      this.cartCount = this.cart.length;
      Swal.fire({
        icon: 'success',
        title: 'Added to your Cart!',
        text: 'Your item has been added to the Cart.',
        showConfirmButton: false,
        timer: 1500
     });
      console.log('Cart updated with wishlist items:', this.cart);
    }
    

    removeFromWish(productId: number): void {
      if (!this.userId) return;
      this.wish = this.wish.filter(product => product.id !== productId);
      this.saveWish();
      console.log('Wish after removal:', this.wish);
    }
  
    updateQuantitywish(product: Product, increase: boolean): void {
      if (increase) {
        product.quantity++;
      } else if (product.quantity > 1) {
        product.quantity--;
      }
      this.saveWish();
      console.log('Wish after quantity update:', this.wish);
    }
  
   
  
    loadWish(): void {
      if (!this.userId) return;
      const storedCart = localStorage.getItem(`wish_${this.userId}`);
      if (storedCart) {
        this.wish = JSON.parse(storedCart);
        console.log('Loaded Wish:', this.wish);
      } else {
        console.log('No Wish found for user:', this.userId);
      }
    }
  
    saveWish(): void {
      if (!this.userId) return;
      localStorage.setItem(`wish_${this.userId}`, JSON.stringify(this.wish));
      console.log('Wish saved:', this.wish);
    }

    viewProductDetails(productId: number): void {
      this.router.navigate(['/product', productId]); 
    }

//Cart

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

getTotalPrice(): number {
  return this.cart.reduce((acc, product) => acc + (product.price * product.quantity), 0);
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
  

