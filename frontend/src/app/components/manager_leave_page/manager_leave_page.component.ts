import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LeaveService } from '../../services/leave.servce';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-manager-leave-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager_leave_page.component.html',
  styleUrls: ['./manager_leave_page.component.css']
})
export class ManagerLeavePageComponent implements OnInit {

  allLeaves: any[] = [];
  isLoadingData = false;
  loadingLeaveIds: Set<string> = new Set();

  userEmail: string = '';
  uidToName: { [uid: string]: string } = {};

  isNamesLoaded: boolean = false; 

  constructor(
    private leaveService: LeaveService,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail'); 
    this.userEmail = email ? email : 'Manager';
    this.loadData();
  }

  logout() {
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
  }

  async loadData() {
    this.isLoadingData = true;
    this.isNamesLoaded = false;

    this.leaveService.getAllLeaves().subscribe({
      next: async (data) => {
        this.allLeaves = data;

        // Get unique UIDs to avoid calling Firestore multiple times for the same person
        const uids = Array.from(new Set(this.allLeaves.map(l => l.employee_id)));
        
        const promises = uids.map(async uid => {
          try {
            // Only fetch if we haven't already fetched this name
            if (!this.uidToName[uid]) {
              const email = await this.authService.getUserEmailByUid(uid);
              this.uidToName[uid] = this.extractNameFromEmail(email);
            }
          } catch (err) {
            console.error(`Failed to fetch name for UID ${uid}`, err);
            this.uidToName[uid] = 'Unknown';
          }
        });

        // This waits for all "getUserEmailByUid" calls to finish
        await Promise.all(promises);
        
        this.isNamesLoaded = true;
        this.isLoadingData = false;
        
        // 🔥 THIS IS THE FIX: 
        // Because 'await' happens outside of Angular's normal "zone",
        // we must manually tell it to refresh the HTML with the new names.
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isLoadingData = false;
      }
    });
  }

  updateStatus(id: string, action: 'approve' | 'reject') {
    if (this.loadingLeaveIds.has(id)) return;
    this.loadingLeaveIds.add(id);

    this.leaveService.updateLeaveStatus(id, action).subscribe({
      next: () => {
        this.loadingLeaveIds.delete(id);
        this.loadData();
      },
      error: (err) => {
        console.error(err);
        this.loadingLeaveIds.delete(id);
      }
    });
  }

  getStatusColor(status: string): string {
    if (status === 'approved') return 'green';
    if (status === 'rejected') return 'red';
    return 'orange'; 
  }

  isLeaveUpdating(id: string): boolean {
    return this.loadingLeaveIds.has(id);
  }

  extractNameFromEmail(email: string): string {
    if (!email) return 'Unknown';
    const namePart = email.split('@')[0];
    const parts = namePart.split(/[._]/);
    return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  }
}