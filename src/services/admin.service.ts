// Admin Service
import { api, PaginatedResponse } from '@/lib/api';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_approved: boolean;
  is_active: boolean;
  date_joined: string;
  last_login?: string;
  employee_id?: string;
  admission_number?: string;
  department?: string;
  phone_number?: string;
  email_verified: boolean;
  avatar_url?: string;
}

export interface UserFilters {
  role?: string;
  is_approved?: boolean;
  is_active?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface BulkActionRequest {
  user_ids: number[];
  action: 'approve' | 'reject' | 'activate' | 'deactivate' | 'delete';
  reason?: string;
}

export interface DashboardStats {
  users: {
    total_users: number;
    active_users: number;
    students: number;
    lecturers: number;
    security: number;
    admins: number;
    pending_approval: number;
    new_registrations_today: number;
  };
  academics: {
    total_courses: number;
    active_courses: number;
    total_assignments: number;
    pending_submissions: number;
    average_gpa: string;
  };
  security: {
    total_access_logs: number;
    failed_login_attempts: number;
    suspicious_activities: number;
    active_sessions: number;
  };
  system: {
    server_uptime: string;
    api_requests_today: number;
    storage_used: string;
    storage_total: string;
  };
}

export interface SecurityLog {
  id: number;
  user_id: number;
  username: string;
  action: string;
  timestamp: string;
  ip_address: string;
  user_agent: string;
  success: boolean;
  details?: any;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: {
    id: number;
    name: string;
    email: string;
  };
  department: string;
  credits: number;
  year: string;
  semester: string;
  enrollment_count: number;
  max_enrollment: number;
  status: string;
  created_date: string;
}

export class AdminService {
  private static instance: AdminService;

  static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  // User Management
  async getUsers(filters: UserFilters = {}): Promise<PaginatedResponse<AdminUser>> {
    return api.request<PaginatedResponse<AdminUser>>('/admin/users/', {
      params: filters as Record<string, string>,
    });
  }

  async getUserDetails(userId: number): Promise<AdminUser> {
    return api.request<AdminUser>(`/admin/users/${userId}/`);
  }

  async updateUser(userId: number, data: Partial<AdminUser>): Promise<{ message: string; user: AdminUser }> {
    return api.request(`/admin/users/${userId}/`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteUser(userId: number, permanent = false): Promise<{ message: string }> {
    return api.request(`/admin/users/${userId}/`, {
      method: 'DELETE',
      params: { permanent: permanent.toString() },
    });
  }

  async bulkUserActions(request: BulkActionRequest): Promise<any> {
    return api.request('/admin/users/bulk-actions/', {
      method: 'POST',
      body: request,
    });
  }

  // Student Management
  async getStudents(filters: any = {}): Promise<{ students: AdminUser[]; total_count: number }> {
    return api.request('/admin/students/', {
      params: filters,
    });
  }

  async getStudentDetails(studentId: number): Promise<any> {
    return api.request(`/admin/students/${studentId}/`);
  }

  async updateStudent(studentId: number, data: any): Promise<{ message: string }> {
    return api.request(`/admin/students/${studentId}/`, {
      method: 'PATCH',
      body: data,
    });
  }

  async expireStudentId(studentId: number): Promise<{ message: string }> {
    return api.request(`/admin/students/${studentId}/expire-id/`, {
      method: 'POST',
    });
  }

  // Lecturer Management
  async getLecturers(filters: any = {}): Promise<{ lecturers: AdminUser[]; total_count: number }> {
    return api.request('/admin/lecturers/', {
      params: filters,
    });
  }

  async getLecturerDetails(lecturerId: number): Promise<any> {
    return api.request(`/admin/lecturers/${lecturerId}/`);
  }

  async createLecturer(data: any): Promise<{ message: string; lecturer: AdminUser }> {
    return api.request('/admin/lecturers/', {
      method: 'POST',
      body: data,
    });
  }

  async updateLecturer(lecturerId: number, data: any): Promise<{ message: string }> {
    return api.request(`/admin/lecturers/${lecturerId}/`, {
      method: 'PATCH',
      body: data,
    });
  }

  // Security User Management
  async getSecurityUsers(filters: any = {}): Promise<{ security_users: AdminUser[]; total_count: number }> {
    return api.request('/admin/security-users/', {
      params: filters,
    });
  }

  async manageSecurityUser(userId: number, action: string): Promise<{ message: string }> {
    return api.request(`/admin/security-users/${userId}/`, {
      method: 'PATCH',
      body: { action },
    });
  }

  // Course Management
  async getCourses(filters: any = {}): Promise<PaginatedResponse<Course>> {
    return api.request<PaginatedResponse<Course>>('/admin/courses/', {
      params: filters,
    });
  }

  async createCourse(data: any): Promise<any> {
    return api.request('/admin/courses/', {
      method: 'POST',
      body: data,
    });
  }

  async assignLecturerToCourse(courseId: string, lecturerId: number): Promise<any> {
    return api.request(`/admin/courses/${courseId}/assign-lecturer/`, {
      method: 'POST',
      body: { lecturer_id: lecturerId },
    });
  }

  // Analytics and Reports
  async getDashboardStats(): Promise<DashboardStats> {
    return api.request<DashboardStats>('/admin/dashboard/stats/');
  }

  async getUserActivityReport(startDate: string, endDate: string, filters: any = {}): Promise<any> {
    return api.request('/admin/reports/user-activity/', {
      params: { start_date: startDate, end_date: endDate, ...filters },
    });
  }

  async getAcademicPerformanceReport(filters: any = {}): Promise<any> {
    return api.request('/admin/reports/academic-performance/', {
      params: filters,
    });
  }

  // Security Management
  async getSecurityLogs(filters: any = {}): Promise<PaginatedResponse<SecurityLog>> {
    return api.request<PaginatedResponse<SecurityLog>>('/admin/security/logs/', {
      params: filters,
    });
  }

  async getFailedLoginAnalysis(): Promise<any> {
    return api.request('/admin/security/failed-logins/');
  }

  // System Configuration
  async getSystemConfig(): Promise<any> {
    return api.request('/admin/system/config/');
  }

  async updateSystemConfig(config: any): Promise<any> {
    return api.request('/admin/system/config/', {
      method: 'PUT',
      body: config,
    });
  }

  // Announcements
  async sendAnnouncement(data: any): Promise<any> {
    return api.request('/admin/announcements/', {
      method: 'POST',
      body: data,
    });
  }

  // Backup Management
  async createBackup(data: any): Promise<any> {
    return api.request('/admin/system/backup/', {
      method: 'POST',
      body: data,
    });
  }

  async getBackups(): Promise<any> {
    return api.request('/admin/system/backups/');
  }
}

export const adminService = AdminService.getInstance();