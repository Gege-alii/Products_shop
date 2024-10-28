import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs from 'emailjs-com';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})

export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  formStatus: string = '';
  wishCount: number = 0;
  cartCount: number = 0;
  userId: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (!this.userId) {
      console.error('No user is logged in');
      this.router.navigate(['/login']);
    } else {
      this.updateCartCount();
      this.updateWishCount();
    }
  }
  onSubmit() {
    if (this.contactForm.valid) {
        const { name, email, phone, message } = this.contactForm.value;
        emailjs.send('service_d7y4wen', 'template_wm52def', {
            from_name: name,
            from_email: email,
            phone: phone,
            message: message,
        }, 'TbhJ3j8pn3Ie5EJj-')
        .then((response) => {
            console.log('Email sent successfully:', response.status, response.text);
            emailjs.send('service_d7y4wen', 'template_confirmation', {
                to_email: email, 
               to_name: name, 
            }, 'TbhJ3j8pn3Ie5EJj-')
            .then((confirmResponse) => {
                console.log('Confirmation email sent successfully:', confirmResponse.status, confirmResponse.text);
                this.formStatus = 'success';
                this.contactForm.reset();
                Swal.fire({
                  icon: 'success',
                  text: 'Your message has been sent! We will respond to you soon.',
                  showConfirmButton: true,
                  timer: 3000
               });
            })
            .catch((error) => {
                console.error('Error sending confirmation email:', error);
                Swal.fire({
                  icon: 'success',
                  text: 'Your message was sent, but there was an error sending the confirmation email. Please check your email later..',
                  showConfirmButton: true,
                  timer: 3000
               });
            });
        })
        .catch((error) => {
            console.error('Error sending email:', error);
            this.formStatus = 'error';
            Swal.fire({
              icon: 'error',
              text: 'There was an error sending your message. Please try again later.',
              showConfirmButton: true,
              timer: 3000
           });
        });
    } else {
        this.formStatus = 'error';
    }
}

  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get phone() { return this.contactForm.get('phone'); }
  get message() { return this.contactForm.get('message'); }

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
