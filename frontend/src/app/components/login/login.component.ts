import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private cdr: ChangeDetectorRef // Forces UI update
  ) {}

  async onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const role = await this.authService.login(this.username, this.password);

      if (role === 'manager') {
        this.router.navigate(['/manager-dashboard']);
      } else if (role === 'employee') {
        this.router.navigate(['/employee-dashboard']);
      } else {
        this.errorMessage = 'Unknown role';
      }
    } catch (err: any) {
      // Firebase modern error code for wrong pass/user is 'auth/invalid-credential'
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        this.errorMessage = 'Invalid email or password';
      } else if (err.message === 'no-role') {
        this.errorMessage = 'User role not assigned';
      } else {
        this.errorMessage = 'Login failed. Please try again';
      }
      console.error('Component caught error:', err);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges(); // Manually tell Angular to refresh the UI now
    }
  }
}