// Lecturer Layout Component
import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  BookOpen,
  FileText,
  Users,
  BarChart3,
  Calendar,
  MessageSquare,
  ClipboardCheck,
  Menu,
  X,
  LogOut,
  User,
  GraduationCap,
  Settings,
  Bell,
  Home
} from 'lucide-react';

const LecturerLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/lecturer/dashboard',
      icon: Home,
    },
    {
      name: 'My Courses',
      href: '/lecturer/courses',
      icon: BookOpen,
    },
    {
      name: 'Assignments',
      href: '/lecturer/assignments',
      icon: FileText,
      children: [
        { name: 'All Assignments', href: '/lecturer/assignments' },
        { name: 'Create Assignment', href: '/lecturer/assignments/create' },
        { name: 'Submissions', href: '/lecturer/assignments/submissions' },
      ],
    },
    {
      name: 'Students',
      href: '/lecturer/students',
      icon: Users,
    },
    {
      name: 'Grading',
      href: '/lecturer/grading',
      icon: ClipboardCheck,
    },
    {
      name: 'Attendance',
      href: '/lecturer/attendance',
      icon: Calendar,
    },
    {
      name: 'Analytics',
      href: '/lecturer/analytics',
      icon: BarChart3,
      children: [
        { name: 'Course Performance', href: '/lecturer/analytics/performance' },
        { name: 'Student Progress', href: '/lecturer/analytics/students' },
        { name: 'Grade Reports', href: '/lecturer/analytics/grades' },
      ],
    },
    {
      name: 'Messages',
      href: '/lecturer/messages',
      icon: MessageSquare,
    },
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-secondary-foreground" />
              </div>
              <span className="text-lg font-semibold">MyKey Lecturer</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive || isActiveRoute(item.href)
                          ? 'bg-secondary text-secondary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </NavLink>
                  
                  {/* Sub-navigation */}
                  {item.children && isActiveRoute(item.href) && (
                    <div className="mt-2 ml-6 space-y-1">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.name}
                          to={child.href}
                          className={({ isActive }) =>
                            `block px-3 py-1 text-sm rounded-md transition-colors ${
                              isActive
                                ? 'bg-secondary/10 text-secondary font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`
                          }
                        >
                          {child.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/95 backdrop-blur px-4 lg:px-6">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>

          <div className="flex-1" />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar_url} alt={user?.first_name} />
                  <AvatarFallback className="bg-gradient-secondary text-secondary-foreground">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                  <p className="text-xs text-secondary font-medium">
                    Lecturer
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LecturerLayout;