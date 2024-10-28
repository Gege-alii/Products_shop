import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AllproductsComponent } from './allproducts/allproducts.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { AboutComponent } from './about/about.component';
import { ChechoutComponent } from './chechout/chechout.component';
import { AccountComponent } from './account/account.component';
import { ContactComponent } from './contact/contact.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ErrorComponent } from './error/error.component'; 

const routes: Routes = [   
  { path: 'all-products', component: AllproductsComponent, canActivate: [AuthGuard] },
  { path: 'product/:id', component: ProductDetailsComponent , canActivate: [AuthGuard]}, 
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component:HomeComponent},
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: ChechoutComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactComponent, canActivate: [AuthGuard] },
  { path: '**', component: ErrorComponent, canActivate: [AuthGuard] } ,
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
