// Admin Dashboard
import React, { useEffect, useState } from 'react';
import { adminService, DashboardStats } from '@/services/admin.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  GraduationCap,
  BookOpen,
  Shield,
  TrendingUp,
  Activity,
  AlertTriangle,
  Server,
  UserPlus,
  FileText,
  Clock,
  CheckCircle
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  const userMetrics = [
    {
      title: 'Total Users',
      value: stats?.users.total_users.toLocaleString() || '0',
      icon: Users,
      description: `${stats?.users.active_users} active`,
      color: 'text-primary',
    },
    {
      title: 'Students',
      value: stats?.users.students.toLocaleString() || '0',
      icon: GraduationCap,
      description: 'Enrolled students',
      color: 'text-secondary',
    },
    {
      title: 'Lecturers',
      value: stats?.users.lecturers.toLocaleString() || '0',
      icon: UserPlus,
      description: 'Active faculty',
      color: 'text-accent',
    },
    {
      title: 'Security Personnel',
      value: stats?.users.security.toLocaleString() || '0',
      icon: Shield,
      description: 'Campus security',
      color: 'text-warning',
    },
  ];

  const academicMetrics = [
    {
      title: 'Total Courses',
      value: stats?.academics.total_courses.toLocaleString() || '0',
      icon: BookOpen,
      description: `${stats?.academics.active_courses} active`,
      color: 'text-primary',
    },
    {
      title: 'Assignments',
      value: stats?.academics.total_assignments.toLocaleString() || '0',
      icon: FileText,
      description: `${stats?.academics.pending_submissions} pending`,
      color: 'text-secondary',
    },
    {
      title: 'Average GPA',
      value: stats?.academics.average_gpa || '0.00',
      icon: TrendingUp,
      description: 'System-wide average',
      color: 'text-success',
    },
    {
      title: 'Pending Approvals',
      value: stats?.users.pending_approval.toLocaleString() || '0',
      icon: Clock,
      description: 'Awaiting review',
      color: 'text-warning',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your eLMS system performance and statistics
        </p>
      </div>

      {/* User Metrics */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          User Management
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {userMetrics.map((metric) => (
            <Card key={metric.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </CardContent>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </Card>
          ))}
        </div>
      </div>

      {/* Academic & System Metrics */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Academic & System Overview
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {academicMetrics.map((metric) => (
            <Card key={metric.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </CardContent>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              System Status
            </CardTitle>
            <CardDescription>
              Real-time system health and security overview
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Server className="w-4 h-4 mr-2 text-success" />
                <span className="text-sm">Server Status</span>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success">
                Online
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-primary" />
                <span className="text-sm">Security Status</span>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Secure
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-warning" />
                <span className="text-sm">Failed Logins (24h)</span>
              </div>
              <Badge variant="secondary" className="bg-warning/10 text-warning">
                {stats?.security.failed_login_attempts || 0}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-success" />
                <span className="text-sm">Active Sessions</span>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success">
                {stats?.security.active_sessions || 0}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* System Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="w-5 h-5 mr-2" />
              System Resources
            </CardTitle>
            <CardDescription>
              Current system usage and storage information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage Used</span>
                <span className="font-medium">
                  {stats?.system.storage_used} / {stats?.system.storage_total}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${((parseFloat(stats?.system.storage_used?.replace('GB', '') || '0') / 
                               parseFloat(stats?.system.storage_total?.replace('GB', '') || '100')) * 100)}%` 
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Uptime</span>
              <Badge variant="outline">
                {stats?.system.server_uptime}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">API Requests Today</span>
              <Badge variant="outline">
                {stats?.system.api_requests_today?.toLocaleString()}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">New Registrations Today</span>
              <Badge variant="secondary" className="bg-accent/10 text-accent">
                {stats?.users.new_registrations_today}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;