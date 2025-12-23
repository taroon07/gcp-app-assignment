  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';

  @Injectable({ providedIn: 'root' })
  export class LeaveService {
    private baseUrl = 'https://still-gravity-478807-t5.el.r.appspot.com';

    constructor(private http: HttpClient) {}

    getMyLeaves(employeeId: string): Observable<any> {
      return this.http.get(`${this.baseUrl}/leave/my-leaves/${employeeId}`);
    }

    applyLeave(payload: any): Observable<any> {
      return this.http.post(`${this.baseUrl}/leave/apply`, payload);
    }

    getAllLeaves(): Observable<any> {
      return this.http.get(`${this.baseUrl}/leave/all`);
    }

    updateLeaveStatus(leaveId: string, action: 'approve' | 'reject'): Observable<any> {
      return this.http.post(`${this.baseUrl}/leave/${leaveId}/${action}`, {});
    }
  }
