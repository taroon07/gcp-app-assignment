import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { EmployeeLeavePageComponent } from './components/employee_leave_page/employee_leave_page.component'
import { ManagerLeavePageComponent } from './components/manager_leave_page/manager_leave_page.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'manager-dashboard', component: ManagerLeavePageComponent },
  { path: 'employee-dashboard', component: EmployeeLeavePageComponent }
  // Add more routes here
  // { path: 'dashboard', component: DashboardComponent }
];
