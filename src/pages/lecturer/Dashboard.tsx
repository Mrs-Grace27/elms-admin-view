// Lecturer Dashboard
import React, { useEffect, useState } from 'react';
import { lecturerService, LecturerDashboard as DashboardData } from '@/services/lecturer.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  FileText,
  Clock,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  Plus,
  MessageSquare,
  Eye
} from 'lucide-react';

const LecturerDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await lecturerService.getDashboard();
        setDashboardData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  const quickStats = [
    {
      title: 'Total Courses',
      value: dashboardData?.course_summary.total_courses || 0,
      icon: BookOpen,
      description: `${dashboardData?.course_summary.active_courses || 0} active`,
      color: 'text-secondary',
      onClick: () => navigate('/lecturer/courses'),
    },
    {
      title: 'Total Students',
      value: dashboardData?.course_summary.total_students || 0,
      icon: Users,
      description: 'Across all courses',
      color: 'text-primary',
      onClick: () => navigate('/lecturer/students'),
    },
    {
      title: 'Pending Submissions',
      value: dashboardData?.course_summary.pending_submissions || 0,
      icon: FileText,
      description: 'Need grading',
      color: 'text-warning',
      onClick: () => navigate('/lecturer/grading'),
    },
    {
      title: 'This Week',
      value: dashboardData?.upcoming_deadlines.length || 0,
      icon: Calendar,
      description: 'Upcoming deadlines',
      color: 'text-accent',
      onClick: () => navigate('/lecturer/assignments'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {dashboardData?.lecturer_info.name}
          </h1>
          <p className="text-muted-foreground">
            {dashboardData?.lecturer_info.department} • {dashboardData?.lecturer_info.employee_id}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/lecturer/assignments/create')}>
            <Plus className="w-4 h-4 mr-2" />
            New Assignment
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <Card 
            key={stat.title} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={stat.onClick}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest submissions and student activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.recent_activities && dashboardData.recent_activities.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recent_activities.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                      {activity.type === 'assignment_submission' ? (
                        <FileText className="w-4 h-4 text-secondary" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-success" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.student_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.assignment} • {activity.course}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/lecturer/grading')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View All Activities
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No recent activities</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>
              Assignment deadlines requiring your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.upcoming_deadlines && dashboardData.upcoming_deadlines.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.upcoming_deadlines.slice(0, 5).map((deadline, index) => {
                  const dueDate = new Date(deadline.due_date);
                  const daysUntil = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {deadline.assignment}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {deadline.course} • {deadline.submissions_received}/{deadline.total_students} submitted
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={daysUntil <= 1 ? "destructive" : daysUntil <= 3 ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/lecturer/assignments')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View All Assignments
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming deadlines</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => navigate('/lecturer/assignments/create')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Assignment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/lecturer/courses')}>
          <CardContent className="flex items-center p-6">
            <BookOpen className="w-8 h-8 text-secondary mr-4" />
            <div>
              <h3 className="font-semibold">Manage Courses</h3>
              <p className="text-sm text-muted-foreground">View and update your courses</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/lecturer/grading')}>
          <CardContent className="flex items-center p-6">
            <FileText className="w-8 h-8 text-primary mr-4" />
            <div>
              <h3 className="font-semibold">Grade Submissions</h3>
              <p className="text-sm text-muted-foreground">Review and grade student work</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/lecturer/messages')}>
          <CardContent className="flex items-center p-6">
            <MessageSquare className="w-8 h-8 text-accent mr-4" />
            <div>
              <h3 className="font-semibold">Send Message</h3>
              <p className="text-sm text-muted-foreground">Communicate with students</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LecturerDashboard;