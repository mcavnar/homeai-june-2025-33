import React, { useState } from "react";
import { 
  FileText, 
  Star, 
  Plus, 
  MapPin, 
  Calendar, 
  DollarSign,
  MoreVertical,
  Edit,
  Trash2,
  AlertTriangle,
  AlertCircle,
  Info
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// TypeScript interfaces
interface Report {
  id: string;
  name: string;
  description?: string;
  address: string;
  inspectionDate: Date;
  createdAt: Date;
  issueCounts: {
    critical: number;
    major: number;
    minor: number;
  };
  isPrimary: boolean;
  estimatedValue?: number;
  status: 'completed' | 'processing' | 'failed';
}

interface ReportsDashboardProps {
  reports?: Report[];
  onNewReport?: () => void;
  onEditReport?: (reportId: string, data: { name: string; description: string }) => void;
  onDeleteReport?: (reportId: string) => void;
  onSetPrimary?: (reportId: string) => void;
  onReportClick?: (reportId: string) => void;
  isLoading?: boolean;
  className?: string;
}

// Mock data for demonstration
const mockReports: Report[] = [
  {
    id: "1",
    name: "Main Street Property Inspection",
    description: "Comprehensive inspection of 3-bedroom family home",
    address: "123 Main Street, Anytown, CA 90210",
    inspectionDate: new Date("2024-03-15"),
    createdAt: new Date("2024-03-15"),
    issueCounts: { critical: 2, major: 5, minor: 8 },
    isPrimary: true,
    estimatedValue: 485000,
    status: 'completed'
  },
  {
    id: "2",
    name: "Oak Avenue Duplex - Unit A",
    description: "Investment property evaluation",
    address: "456 Oak Avenue, Springfield, IL 62701",
    inspectionDate: new Date("2024-03-10"),
    createdAt: new Date("2024-03-10"),
    issueCounts: { critical: 0, major: 3, minor: 6 },
    isPrimary: false,
    estimatedValue: 320000,
    status: 'completed'
  },
  {
    id: "3",
    name: "Pine Ridge Condo Unit 2B",
    address: "789 Pine Ridge Drive, Unit 2B, Boulder, CO 80301",
    inspectionDate: new Date("2024-03-08"),
    createdAt: new Date("2024-03-08"),
    issueCounts: { critical: 1, major: 2, minor: 4 },
    isPrimary: false,
    status: 'processing'
  },
  {
    id: "4",
    name: "Sunset Boulevard Commercial Space",
    description: "Retail storefront inspection for lease agreement",
    address: "999 Sunset Boulevard, Los Angeles, CA 90028",
    inspectionDate: new Date("2024-03-05"),
    createdAt: new Date("2024-03-05"),
    issueCounts: { critical: 3, major: 7, minor: 12 },
    isPrimary: false,
    estimatedValue: 750000,
    status: 'completed'
  },
  {
    id: "5",
    name: "Riverside Apartment Complex",
    address: "555 Riverside Drive, Portland, OR 97201",
    inspectionDate: new Date("2024-02-28"),
    createdAt: new Date("2024-02-28"),
    issueCounts: { critical: 0, major: 1, minor: 3 },
    isPrimary: false,
    status: 'failed'
  }
];

// Helper functions
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusColor = (status: Report['status']) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800 border-green-200';
    case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';  
    case 'failed': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getTotalIssues = (issueCounts: Report['issueCounts']) => {
  return issueCounts.critical + issueCounts.major + issueCounts.minor;
};

// Loading Skeleton Component
const ReportCardSkeleton: React.FC = () => (
  <Card className="h-[280px]">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-6 w-12" />
      </div>
      <Skeleton className="h-4 w-1/2" />
    </CardContent>
  </Card>
);

// Empty State Component
const EmptyState: React.FC<{ onNewReport?: () => void }> = ({ onNewReport }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
    <div className="text-center space-y-4 max-w-md">
      <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
        <FileText className="h-12 w-12 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">No reports yet</h3>
        <p className="text-sm text-muted-foreground">
          Get started by creating your first inspection report. Upload your documents and get instant analysis.
        </p>
      </div>
      <Button onClick={onNewReport} size="lg" className="mt-6">
        <Plus className="h-4 w-4 mr-2" />
        Create Your First Report
      </Button>
    </div>
  </div>
);

// Report Card Component
const ReportCard: React.FC<{
  report: Report;
  onEdit: () => void;
  onDelete: () => void;
  onSetPrimary: () => void;
  onReportClick: () => void;
}> = ({ report, onEdit, onDelete, onSetPrimary, onReportClick }) => {
  const totalIssues = getTotalIssues(report.issueCounts);

  return (
    <Card 
      className="h-[280px] hover:shadow-lg transition-all duration-200 cursor-pointer group border-border hover:border-primary/20"
      onClick={onReportClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold truncate group-hover:text-primary transition-colors">
                {report.name}
              </CardTitle>
              {report.isPrimary && (
                <Star className="h-4 w-4 fill-current text-yellow-500 flex-shrink-0" />
              )}
            </div>
            <Badge 
              variant="secondary" 
              className={cn("text-xs w-fit", getStatusColor(report.status))}
            >
              {report.status}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </DropdownMenuItem>
              {!report.isPrimary && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSetPrimary(); }}>
                  <Star className="h-4 w-4 mr-2" />
                  Set as Primary
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="truncate" title={report.address}>{report.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>Inspected {formatDate(report.inspectionDate)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Issues Found</span>
            <span className="font-medium">{totalIssues} total</span>
          </div>
          <div className="flex gap-2">
            {report.issueCounts.critical > 0 && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {report.issueCounts.critical} Critical
              </Badge>
            )}
            {report.issueCounts.major > 0 && (
              <Badge className="text-xs bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100">
                <AlertCircle className="h-3 w-3 mr-1" />
                {report.issueCounts.major} Major
              </Badge>
            )}
            {report.issueCounts.minor > 0 && (
              <Badge className="text-xs bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
                <Info className="h-3 w-3 mr-1" />
                {report.issueCounts.minor} Minor
              </Badge>
            )}
          </div>
        </div>

        {report.estimatedValue && (
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span>Est. Value: {formatCurrency(report.estimatedValue)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Edit Report Modal Component
const EditReportModal: React.FC<{
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string }) => void;
}> = ({ report, isOpen, onClose, onSave }) => {
  const [name, setName] = useState(report?.name || '');
  const [description, setDescription] = useState(report?.description || '');

  React.useEffect(() => {
    if (report) {
      setName(report.name);
      setDescription(report.description || '');
    }
  }, [report]);

  const handleSave = () => {
    onSave({ name: name.trim(), description: description.trim() });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Report Details</DialogTitle>
          <DialogDescription>
            Make changes to your report information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Report Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter report name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for this report"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmModal: React.FC<{
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ report, isOpen, onClose, onConfirm }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Report</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{report?.name}"? This action cannot be undone and all associated data will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Report
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Main Reports Dashboard Component
export const ReportsDashboard: React.FC<ReportsDashboardProps> = ({
  reports = mockReports, // Use mock data by default
  onNewReport,
  onEditReport,
  onDeleteReport,
  onSetPrimary,
  onReportClick,
  isLoading = false,
  className
}) => {
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [deletingReport, setDeletingReport] = useState<Report | null>(null);

  const handleEditReport = (data: { name: string; description: string }) => {
    if (editingReport && onEditReport) {
      onEditReport(editingReport.id, data);
    }
  };

  const handleDeleteReport = () => {
    if (deletingReport && onDeleteReport) {
      onDeleteReport(deletingReport.id);
      setDeletingReport(null);
    }
  };

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Your Reports</h1>
          <p className="text-muted-foreground">
            Manage and review your inspection reports
          </p>
        </div>
        <Button onClick={onNewReport}>
          <Plus className="h-4 w-4 mr-2" />
          New Report
        </Button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading state
          Array.from({ length: 6 }).map((_, i) => (
            <ReportCardSkeleton key={i} />
          ))
        ) : !reports || reports.length === 0 ? (
          // Empty state
          <EmptyState onNewReport={onNewReport} />
        ) : (
          // Reports
          reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onEdit={() => setEditingReport(report)}
              onDelete={() => setDeletingReport(report)}
              onSetPrimary={() => onSetPrimary?.(report.id)}
              onReportClick={() => onReportClick?.(report.id)}
            />
          ))
        )}
      </div>

      {/* Modals */}
      <EditReportModal
        report={editingReport}
        isOpen={!!editingReport}
        onClose={() => setEditingReport(null)}
        onSave={handleEditReport}
      />

      <DeleteConfirmModal
        report={deletingReport}
        isOpen={!!deletingReport}
        onClose={() => setDeletingReport(null)}
        onConfirm={handleDeleteReport}
      />
    </div>
  );
};

export type { Report, ReportsDashboardProps };