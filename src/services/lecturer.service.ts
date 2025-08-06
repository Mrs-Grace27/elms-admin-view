// Lecturer Service
import { api, PaginatedResponse } from '@/lib/api';

export interface LecturerDashboard {
  lecturer_info: {
    name: string;
    employee_id: string;
    department: string;
  };
  course_summary: {
    total_courses: number;
    active_courses: number;
    total_students: number;
    pending_submissions: number;
  };
  recent_activities: Array<{
    type: string;
    student_name: string;
    course: string;
    assignment: string;
    timestamp: string;
  }>;
  upcoming_deadlines: Array<{
    assignment: string;
    course: string;
    due_date: string;
    submissions_received: number;
    total_students: number;
  }>;
}

export interface LecturerCourse {
  id: string;
  code: string;
  name: string;
  credits: number;
  year: string;
  semester: string;
  description?: string;
  room?: string;
  enrollment_count: number;
  max_enrollment: number;
  status: string;
  schedule?: Array<{
    day: string;
    start_time: string;
    end_time: string;
    room: string;
  }>;
  total_assignments: number;
  pending_submissions: number;
  average_grade: string;
  created_date: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  created_date: string;
  max_points: number;
  weight_percentage?: number;
  status: string;
  attachments?: string[];
  submissions?: {
    total_students: number;
    submitted: number;
    pending: number;
    late_submissions: number;
    graded: number;
    average_score: number;
  };
  late_submission_penalty?: number;
  allow_late_submission?: boolean;
}

export interface Student {
  id: number;
  username: string;
  name: string;
  email: string;
  current_grade?: string;
  attendance_percentage?: number;
  assignments_completed?: number;
  assignments_total?: number;
}

export interface Submission {
  id: string;
  student: Student;
  submission_date: string;
  is_late: boolean;
  status: string;
  score?: number;
  grade?: string;
  feedback?: string;
  files: Array<{
    name: string;
    size: string;
    download_url: string;
  }>;
  attempts: number;
}

export interface CourseFilters {
  year?: string;
  semester?: string;
  status?: string;
}

export interface AssignmentFilters {
  status?: string;
  due_date_from?: string;
  due_date_to?: string;
}

export interface SubmissionFilters {
  status?: string;
  student_id?: number;
  graded?: boolean;
}

export class LecturerService {
  private static instance: LecturerService;

  static getInstance(): LecturerService {
    if (!LecturerService.instance) {
      LecturerService.instance = new LecturerService();
    }
    return LecturerService.instance;
  }

  // Dashboard
  async getDashboard(): Promise<LecturerDashboard> {
    return api.request<LecturerDashboard>('/lecturer/dashboard/');
  }

  // Course Management
  async getCourses(filters: CourseFilters = {}): Promise<PaginatedResponse<LecturerCourse>> {
    return api.request<PaginatedResponse<LecturerCourse>>('/lecturer/courses/', {
      params: filters as Record<string, string>,
    });
  }

  async getCourseDetails(courseId: string): Promise<LecturerCourse & { enrolled_students: Student[]; assignments: Assignment[] }> {
    return api.request(`/lecturer/courses/${courseId}/`);
  }

  async updateCourse(courseId: string, data: Partial<LecturerCourse>): Promise<{ message: string; course: LecturerCourse }> {
    return api.request(`/lecturer/courses/${courseId}/`, {
      method: 'PUT',
      body: data,
    });
  }

  // Assignment Management
  async getCourseAssignments(courseId: string, filters: AssignmentFilters = {}): Promise<PaginatedResponse<Assignment>> {
    return api.request<PaginatedResponse<Assignment>>(`/lecturer/courses/${courseId}/assignments/`, {
      params: filters as Record<string, string>,
    });
  }

  async createAssignment(courseId: string, data: Partial<Assignment>): Promise<{ message: string; assignment: Assignment }> {
    return api.request(`/lecturer/courses/${courseId}/assignments/`, {
      method: 'POST',
      body: data,
    });
  }

  async getAssignmentDetails(assignmentId: string): Promise<Assignment> {
    return api.request(`/lecturer/assignments/${assignmentId}/`);
  }

  async updateAssignment(assignmentId: string, data: Partial<Assignment> & { notify_students?: boolean }): Promise<{ message: string }> {
    return api.request(`/lecturer/assignments/${assignmentId}/`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteAssignment(assignmentId: string): Promise<{ message: string }> {
    return api.request(`/lecturer/assignments/${assignmentId}/`, {
      method: 'DELETE',
    });
  }

  // Submission Management
  async getAssignmentSubmissions(
    assignmentId: string, 
    filters: SubmissionFilters = {}
  ): Promise<{
    assignment: Assignment;
    submissions: Submission[];
    statistics: any;
  }> {
    return api.request(`/lecturer/assignments/${assignmentId}/submissions/`, {
      params: filters as Record<string, string>,
    });
  }

  async gradeSubmission(
    submissionId: string, 
    data: { score: number; feedback: string; return_to_student?: boolean }
  ): Promise<{ message: string; submission: Submission }> {
    return api.request(`/lecturer/submissions/${submissionId}/grade/`, {
      method: 'POST',
      body: data,
    });
  }

  async bulkGradeSubmissions(
    assignmentId: string,
    data: {
      grades: Array<{ submission_id: string; score: number; feedback: string }>;
      send_notifications?: boolean;
    }
  ): Promise<{ message: string; graded_count: number; failed_count: number }> {
    return api.request(`/lecturer/assignments/${assignmentId}/bulk-grade/`, {
      method: 'POST',
      body: data,
    });
  }

  // Communication
  async sendCourseMessage(
    courseId: string,
    data: {
      subject: string;
      message: string;
      priority?: 'low' | 'normal' | 'high';
      send_email?: boolean;
      send_push?: boolean;
    }
  ): Promise<{ message: string; recipients_count: number }> {
    return api.request(`/lecturer/courses/${courseId}/message/`, {
      method: 'POST',
      body: data,
    });
  }

  // Analytics
  async getCourseAnalytics(
    courseId: string,
    filters: { period?: string; metric?: string } = {}
  ): Promise<any> {
    return api.request(`/lecturer/courses/${courseId}/analytics/`, {
      params: filters,
    });
  }

  async generateGradeReport(
    courseId: string,
    filters: { format?: string; include_details?: boolean } = {}
  ): Promise<any> {
    return api.request(`/lecturer/courses/${courseId}/grade-report/`, {
      params: filters as Record<string, string>,
    });
  }

  // Attendance Management
  async markAttendance(
    courseId: string,
    data: {
      session_date: string;
      attendance_records: Array<{
        student_id: number;
        status: 'present' | 'absent' | 'late';
        notes?: string;
        arrival_time?: string;
      }>;
      notify_absent_students?: boolean;
    }
  ): Promise<{ message: string; session: any }> {
    return api.request(`/lecturer/courses/${courseId}/attendance/`, {
      method: 'POST',
      body: data,
    });
  }

  async getAttendanceRecords(
    courseId: string,
    filters: { start_date?: string; end_date?: string; student_id?: number } = {}
  ): Promise<any> {
    const params = {
      ...filters,
      student_id: filters.student_id?.toString(),
    };
    return api.request(`/lecturer/courses/${courseId}/attendance/records/`, {
      params: params as Record<string, string>,
    });
  }
}

export const lecturerService = LecturerService.getInstance();