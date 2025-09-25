import React, { useState } from "react";
import { 
  FileText, 
  Star, 
  Plus, 
  Menu, 
  X, 
  ChevronRight,
  Home,
  User,
  Settings,
  LogOut,
  Bell,
  Search
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ReportSelector } from "./ReportSelector";

// TypeScript interfaces
interface Report {
  id: string;
  name: string;
  address: string;
  createdAt: Date;
  issueCounts: {
    high: number;
    medium: number;
    low: number;
  };
  isPrimary: boolean;
  status: 'completed' | 'processing' | 'failed';
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface MultiReportNavigationProps {
  reports?: Report[];
  selectedReportId?: string;
  currentUser?: User;
  onReportSelect?: (reportId: string) => void;
  onNewReport?: () => void;
  onLogout?: () => void;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

// Mock data
const mockReports: Report[] = [
  {
    id: "1",
    name: "Main Street Property",
    address: "123 Main Street, Anytown, CA 90210",
    createdAt: new Date("2024-03-15"),
    issueCounts: { high: 3, medium: 8, low: 12 },
    isPrimary: true,
    status: 'completed'
  },
  {
    id: "2",
    name: "Oak Avenue Duplex",
    address: "456 Oak Avenue, Springfield, IL 62701",
    createdAt: new Date("2024-03-10"),
    issueCounts: { high: 1, medium: 5, low: 7 },
    isPrimary: false,
    status: 'completed'
  }
];

const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  initials: "JD"
};

// Compact Report Selector for Navigation
const CompactReportSelector: React.FC<{
  reports: Report[];
  selectedReportId?: string;
  onReportSelect?: (reportId: string) => void;
}> = ({ reports, selectedReportId, onReportSelect }) => {
  if (!reports || reports.length <= 1) return null;

  const selectedReport = reports.find(r => r.id === selectedReportId) || reports[0];

  return (
    <Select value={selectedReportId || reports[0]?.id} onValueChange={onReportSelect}>
      <SelectTrigger className="w-[280px] h-9 bg-background/95 backdrop-blur-sm border-border/50">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="truncate font-medium text-sm">
            {selectedReport?.name || 'Select Report'}
          </span>
          {selectedReport?.isPrimary && (
            <Star className="h-3 w-3 fill-current text-yellow-500 flex-shrink-0" />
          )}
        </div>
      </SelectTrigger>
      <SelectContent className="w-[320px]">
        {reports.map((report) => (
          <SelectItem key={report.id} value={report.id} className="p-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium truncate">{report.name}</span>
                {report.isPrimary && (
                  <Star className="h-3 w-3 fill-current text-yellow-500" />
                )}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {report.address}
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

// Breadcrumb Navigation Component
const BreadcrumbNavigation: React.FC<{ breadcrumbs: BreadcrumbItem[] }> = ({ breadcrumbs }) => {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          {breadcrumb.href && !breadcrumb.isActive ? (
            <Link 
              to={breadcrumb.href} 
              className="hover:text-foreground transition-colors truncate"
            >
              {breadcrumb.label}
            </Link>
          ) : (
            <span className={cn(
              "truncate",
              breadcrumb.isActive ? "text-foreground font-medium" : "text-muted-foreground"
            )}>
              {breadcrumb.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// User Menu Component
const UserMenu: React.FC<{ user: User; onLogout?: () => void }> = ({ user, onLogout }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="relative h-9 w-9 rounded-full">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56" align="end" forceMount>
      <div className="flex items-center justify-start gap-2 p-2">
        <div className="flex flex-col space-y-1 leading-none">
          <p className="font-medium">{user.name}</p>
          <p className="w-[200px] truncate text-xs text-muted-foreground">
            {user.email}
          </p>
        </div>
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <User className="mr-2 h-4 w-4" />
        <span>Profile</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Settings className="mr-2 h-4 w-4" />
        <span>Settings</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={onLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// Mobile Menu Component
const MobileMenu: React.FC<{
  reports: Report[];
  selectedReportId?: string;
  onReportSelect?: (reportId: string) => void;
  onNewReport?: () => void;
  user: User;
  onLogout?: () => void;
  breadcrumbs?: BreadcrumbItem[];
}> = ({ reports, selectedReportId, onReportSelect, onNewReport, user, onLogout, breadcrumbs }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="text-left">Navigation</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          {/* User Info */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.name}</p>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>

          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Location</h3>
              <BreadcrumbNavigation breadcrumbs={breadcrumbs} />
            </div>
          )}

          {/* Report Selector */}
          {reports && reports.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Reports</h3>
                <Button onClick={onNewReport} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </div>
              <ReportSelector
                variant="compact"
                reports={reports}
                selectedReportId={selectedReportId}
                onReportSelect={onReportSelect}
                onNewReport={onNewReport}
              />
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Quick Actions</h3>
            <div className="space-y-1">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Search className="h-4 w-4 mr-2" />
                Search Reports
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Logout */}
          <div className="pt-6 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Main Navigation Component
export const MultiReportNavigation: React.FC<MultiReportNavigationProps> = ({
  reports = mockReports,
  selectedReportId,
  currentUser = mockUser,
  onReportSelect,
  onNewReport,
  onLogout,
  breadcrumbs = [],
  className
}) => {
  return (
    <div className={cn("w-full", className)}>
      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          {/* Left Section - Logo/Brand */}
          <div className="flex items-center gap-4">
            <MobileMenu
              reports={reports}
              selectedReportId={selectedReportId}
              onReportSelect={onReportSelect}
              onNewReport={onNewReport}
              user={currentUser}
              onLogout={onLogout}
              breadcrumbs={breadcrumbs}
            />
            <Link to="/" className="flex items-center gap-2 font-bold text-lg">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="hidden sm:inline-block">HomeAI</span>
            </Link>
          </div>

          {/* Center Section - Report Selector (Desktop) */}
          <div className="hidden md:flex flex-1 justify-center max-w-md">
            <CompactReportSelector
              reports={reports}
              selectedReportId={selectedReportId}
              onReportSelect={onReportSelect}
            />
          </div>

          {/* Right Section - Actions & User */}
          <div className="flex items-center gap-3">
            {/* New Report Button (Desktop) */}
            <Button 
              onClick={onNewReport} 
              size="sm" 
              className="hidden sm:inline-flex"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Report
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full"></span>
            </Button>

            {/* User Menu */}
            <UserMenu user={currentUser} onLogout={onLogout} />
          </div>
        </div>
      </header>

      {/* Breadcrumb Navigation (Desktop) */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="hidden md:block border-b bg-muted/30">
          <div className="container px-4 md:px-6 py-3">
            <BreadcrumbNavigation breadcrumbs={breadcrumbs} />
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to generate breadcrumbs from current route
export const generateBreadcrumbs = (
  pathname: string, 
  reportName?: string
): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Always start with Reports
  breadcrumbs.push({
    label: 'Reports',
    href: '/reports'
  });

  // Add report name if available
  if (reportName && segments.includes('results')) {
    breadcrumbs.push({
      label: reportName,
      href: `/results`
    });
  }

  // Add current page
  const currentPage = segments[segments.length - 1];
  if (currentPage && currentPage !== 'reports') {
    const pageLabels: Record<string, string> = {
      'synopsis': 'Synopsis',
      'inspection-report': 'Inspection Report',
      'issues-list': 'Issues List', 
      'key-systems': 'Key Systems',
      'negotiation': 'Negotiation',
      'service-providers': 'Service Providers'
    };

    breadcrumbs.push({
      label: pageLabels[currentPage] || currentPage.charAt(0).toUpperCase() + currentPage.slice(1),
      isActive: true
    });
  }

  return breadcrumbs;
};

export type { Report, User, BreadcrumbItem, MultiReportNavigationProps };