import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LeaveService } from '../../services/leave.servce';
import { Auth, signOut } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-leave-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee_leave_page.component.html',
  styleUrls: ['./employee_leave_page.component.css']
})
export class EmployeeLeavePageComponent implements OnInit {

  leaves: any[] = [];
  userId: string | null = null;
  userEmail: string | null = null;

  showModal = false;

  leave_type = '';
  start_date = '';
  end_date = '';
  reason = '';

  minStartDate = '';
  minEndDate = '';

  isSubmitting = false;
  isLoadingData = false;

  constructor(
    private leaveService: LeaveService,
    private auth: Auth,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setMinDates();

    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.userId = user.uid;
        this.userEmail = user.email ?? "";
        this.loadLeaves();
      }
    });
  }

  // VALIDATION: Checks if all fields have values
  get isFormValid(): boolean {
    return (
      this.leave_type.trim() !== '' &&
      this.start_date !== '' &&
      this.end_date !== '' &&
      this.reason.trim().length >= 5 // Requires at least 5 characters for reason
    );
  }

  setMinDates() {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    this.minStartDate = today.toISOString().split('T')[0];
    this.minEndDate = this.minStartDate;
  }

  onStartDateChange() {
    this.minEndDate = this.start_date;
    if (this.end_date < this.start_date) {
      this.end_date = this.start_date;
    }
  }

  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });
  }

  loadLeaves() {
    if (!this.userId) return;
    this.isLoadingData = true;
    this.leaveService.getMyLeaves(this.userId).subscribe({
      next: (data) => {
        this.leaves = data;
        this.cd.markForCheck();
      },
      error: (err) => console.error(err),
      complete: () => this.isLoadingData = false
    });
  }

  openModal() { this.showModal = true; }
  
  closeModal() {
    if (!this.isSubmitting) {
      this.showModal = false;
      this.resetForm();
    }
  }

  resetForm() {
    this.leave_type = '';
    this.start_date = '';
    this.end_date = '';
    this.reason = '';
    this.minEndDate = this.minStartDate;
  }

  submitLeave() {
    if (!this.userId || this.isSubmitting || !this.isFormValid) return;

    this.isSubmitting = true;

    const payload = {
      employee_id: this.userId,
      leave_type: this.leave_type,
      start_date: this.start_date,
      end_date: this.end_date,
      reason: this.reason
    };

    this.leaveService.applyLeave(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeModal();
        this.loadLeaves();
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
      }
    });
  }

  getStatusColor(status: string) {
    return {
      approved: 'green',
      rejected: 'red',
      pending: 'orange'
    }[status] || 'black';
  }
}