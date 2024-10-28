import { Component, OnInit,  HostListener,ElementRef } from '@angular/core'; 
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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit{
  products: any[] = [];
  ourProducts:any[]=[];
  bestproducts: any[] = [];
  cartCount: number = 0;
  wishCount: number = 0;
  cart: Product[] = [];
  productswish: Product[] = [];
  wish: Product[] = [];
  userId: string | null = null;
  isVisible: boolean = false;
  isBeforeFooter: boolean = false;

  showScrollBtn = false;
  @HostListener('window:scroll', [])
  onWindowScroll() {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

      this.showScrollBtn = scrollPosition > 200; 
  }
  scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });  
  }
  

  constructor(private http: HttpClient, private router: Router, private authService: AuthService,private el: ElementRef) {}



  ngOnInit(): void {
    this.http.get("https://fakestoreapi.com/products").subscribe((data: any) => { 
      const Clothing = data.slice(0, 8).map((product: any) => {
        const discount = Math.random() * 0.3 + 0.1; 
        const salePrice = product.price * (1 - discount);
        const salePercentage = Math.round(discount * 100);
        return {
          ...product,
          salePrice: salePrice.toFixed(2),
          salePercentage: salePercentage
        };
      });
      this.ourProducts = Clothing;
    });

    this.userId = this.authService.getUserId();
      this.loadWish();
      this.updateCartCount();
      this.updateWishCount();

  
      
    this.http.get('https://fakestoreapi.com/products/category/electronics').subscribe((electronicsData: any) => {
      const electronics = electronicsData.map((product: any) => {
        const discount = Math.random() * 0.3 + 0.1; 
        const salePrice = product.price * (1 - discount);
        const salePercentage = Math.round(discount * 100);
        return {
          ...product,
          salePrice: salePrice.toFixed(2),  
          salePercentage: salePercentage    
        };
      });
  
      this.http.get('https://fakestoreapi.com/products/category/men\'s%20clothing').subscribe((clothingData: any) => {
        const mensClothing = clothingData.slice(0, 5).map((product: any) => {
          const discount = Math.random() * 0.3 + 0.1;
          const salePrice = product.price * (1 - discount);
          const salePercentage = Math.round(discount * 100);
          return {
            ...product,
            salePrice: salePrice.toFixed(2),
            salePercentage: salePercentage
          };
        });
        this.products = [...electronics, ...mensClothing];
      });
    });

    this.http.get("https://fakestoreapi.com/products/category/women's%20clothing").subscribe((clothingData: any) => { 
      const womensClothing = clothingData.slice(0, 4).map((product: any) => {
        const discount = Math.random() * 0.3 + 0.1; 
        const salePrice = product.price * (1 - discount);
        const salePercentage = Math.round(discount * 100);
        return {
          ...product,
          salePrice: salePrice.toFixed(2),
          salePercentage: salePercentage
        };
      });

        this.bestproducts = [...womensClothing];
      
    });



    this.userId = this.authService.getUserId();
    if (!this.userId) {
      console.error('No user is logged in');
      this.router.navigate(['/home']);
    } else {
      this.loadCart();
    }
    
  }

  updateCartCount(): void {
    if (this.userId) {
      const cart = localStorage.getItem(`cart_${this.userId}`);
      this.cartCount = cart ? JSON.parse(cart).length : 0;
      
    }
  }

  updateWishCount(): void {
    if (this.userId) {
      const wish = localStorage.getItem(`wish_${this.userId}`);
      this.wishCount = wish ? JSON.parse(wish).length : 0;
    }
  }

  icons = [
    { iconClass: 'fas fa-phone', label: 'Phone' },
    { iconClass: 'fas fa-desktop', label: 'Computer' },
    { iconClass: 'fas fa-clock', label: 'SmartWatch' },
    { iconClass: 'fas fa-camera', label: 'Camera' },
    { iconClass: 'fas fa-headphones', label: 'HeadPhone' },
    { iconClass: 'fas fa-gamepad', label: 'Gaming' }
  ];

 

  next() {
    const slider = document.querySelector('.product-slider') as HTMLElement;
    slider.scrollLeft += slider.offsetWidth;
  }

  prev() {
    const slider = document.querySelector('.product-slider') as HTMLElement;
    slider.scrollLeft -= slider.offsetWidth;
  }

  viewProductDetails(productId: number): void {
  
    this.router.navigate(['/product', productId]); 
    
  }

  logout(): void {
    this.authService.logout(); 
  }

  // Cart

 

  addToCart(product: Product): void {
    if (!this.userId) {
      this.showLoginAlert();
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
  

  // Wihlist

  fetchProductswish(): void {
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
      this.showLoginAlert();
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

  showLoginAlert() {
    Swal.fire({
      title: 'Login Required',
      text: 'Please log in to add items to your cart or wishlist or display product details.',
      icon: 'warning',
      confirmButtonText: 'Login'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/login']);
      }
    });
  }

 
}