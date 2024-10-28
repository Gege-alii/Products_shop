import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { AllproductsComponent } from './allproducts/allproducts.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { AboutComponent } from './about/about.component';
import { ChechoutComponent } from './chechout/chechout.component';
import { AccountComponent } from './account/account.component';
import { ContactComponent } from './contact/contact.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorComponent } from './error/error.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AllproductsComponent,
    ProductDetailsComponent,
    SignupComponent,
    LoginComponent,
    CartComponent,
    WishlistComponent,
    AboutComponent,
    ChechoutComponent,
    AccountComponent,
    ContactComponent,
    ErrorComponent,
    ForgetPasswordComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
