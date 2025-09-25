import React, { useState } from "react";
import { z } from "zod";
import { 
  FileText, 
  Star, 
  MapPin, 
  Calendar, 
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  AlertCircle,
  Info,
  Search,
  Filter
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Validation schema
const editReportSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Report name is required" })
    .max(100, { message: "Report name must be less than 100 characters" }),
  description: z.string()
    .trim()
    .max(500, { message: "Description must be less than 500 characters" })
    .optional()
});

type EditReportFormData = z.infer<typeof editReportSchema>;

// TypeScript interfaces
interface Report {
  id: string;
  name: string;
  description?: string;
  address: string;
  inspectionDate: Date;
  createdAt: Date;
  updatedAt?: Date;
  issueCounts: {
    critical: number;
    major: number;
    minor: number;
  };
  isPrimary: boolean;
  estimatedValue?: number;
  status: 'completed' | 'processing' | 'failed' | 'draft';
}

interface ReportCardProps {
  report: Report;
  onEdit?: (report: Report) => void;
  onDelete?: (reportId: string) => void;
  onSetPrimary?: (reportId: string) => void;
  onClick?: (reportId: string) => void;
  className?: string;
}

interface ReportsListProps {
  reports: Report[];
  onEdit?: (report: Report) => void;
  onDelete?: (reportId: string) => void;
  onSetPrimary?: (reportId: string) => void;
  onReportClick?: (reportId: string) => void;
  isLoading?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  className?: string;
}

interface EditReportModalProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (reportId: string, data: EditReportFormData) => void;
  isLoading?: boolean;
}

// Helper functions
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return 'Yesterday';
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
  return formatDate(date);
};

const getStatusColor = (status: Report['status']) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800 border-green-200';
    case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';  
    case 'failed': return 'bg-red-100 text-red-800 border-red-200';
    case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getStatusLabel = (status: Report['status']) => {
  switch (status) {
    case 'completed': return 'Completed';
    case 'processing': return 'Processing';
    case 'failed': return 'Failed';
    case 'draft': return 'Draft';
    default: return 'Unknown';
  }
};

const getTotalIssues = (issueCounts: Report['issueCounts']) => {
  return issueCounts.critical + issueCounts.major + issueCounts.minor;
};

// ReportCard Component
export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onEdit,
  onDelete,
  onSetPrimary,
  onClick,
  className
}) => {
  const totalIssues = getTotalIssues(report.issueCounts);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on dropdown or buttons
    if ((e.target as HTMLElement).closest('[data-dropdown-trigger]') || 
        (e.target as HTMLElement).closest('button')) {
      return;
    }
    onClick?.(report.id);
  };

  return (
    <Card 
      className={cn(
        "group hover:shadow-lg transition-all duration-200 border-border hover:border-primary/20",
        onClick && "cursor-pointer",
        className
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={cn(
                "font-semibold text-base truncate",
                onClick && "group-hover:text-primary transition-colors"
              )}>
                {report.name}
              </h3>
              {report.isPrimary && (
                <Star className="h-4 w-4 fill-current text-yellow-500 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={cn("text-xs", getStatusColor(report.status))}
              >
                {getStatusLabel(report.status)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Updated {formatRelativeTime(report.updatedAt || report.createdAt)}
              </span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild data-dropdown-trigger>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onClick?.(report.id)}>
                <Eye className="h-4 w-4 mr-2" />
                View Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(report)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </DropdownMenuItem>
              {!report.isPrimary && (
                <DropdownMenuItem onClick={() => onSetPrimary?.(report.id)}>
                  <Star className="h-4 w-4 mr-2" />
                  Set as Primary
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete?.(report.id)}
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
        {/* Description */}
        {report.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {report.description}
          </p>
        )}

        {/* Location and Date */}
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

        {/* Issues Summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Issues Found</span>
            <span className="font-medium">{totalIssues} total</span>
          </div>
          <div className="flex gap-2 flex-wrap">
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

        {/* Estimated Value */}
        {report.estimatedValue && (
          <div className="flex items-center gap-2 text-sm font-medium text-foreground pt-2 border-t">
            <span className="text-muted-foreground">Est. Value:</span>
            <span className="text-green-600">
              ${report.estimatedValue.toLocaleString()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Loading skeleton for report card
const ReportCardSkeleton: React.FC = () => (
  <Card className="h-[320px]">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-6 w-14" />
      </div>
    </CardContent>
  </Card>
);

// Empty state component
const EmptyReportsState: React.FC<{ searchQuery?: string }> = ({ searchQuery }) => (
  <div className="text-center py-12">
    <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
      <FileText className="h-12 w-12 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">
      {searchQuery ? 'No reports found' : 'No reports yet'}
    </h3>
    <p className="text-muted-foreground max-w-md mx-auto">
      {searchQuery 
        ? `No reports match "${searchQuery}". Try adjusting your search terms.`
        : 'Get started by creating your first inspection report.'
      }
    </p>
  </div>
);

// ReportsList Component
export const ReportsList: React.FC<ReportsListProps> = ({
  reports,
  onEdit,
  onDelete,
  onSetPrimary,
  onReportClick,
  isLoading = false,
  searchQuery = '',
  onSearchChange,
  className
}) => {
  // Filter reports based on search query
  const filteredReports = reports.filter(report => 
    report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading state
          Array.from({ length: 6 }).map((_, i) => (
            <ReportCardSkeleton key={i} />
          ))
        ) : filteredReports.length === 0 ? (
          // Empty state
          <div className="col-span-full">
            <EmptyReportsState searchQuery={searchQuery} />
          </div>
        ) : (
          // Reports
          filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onEdit={onEdit}
              onDelete={onDelete}
              onSetPrimary={onSetPrimary}
              onClick={onReportClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

// EditReportModal Component
export const EditReportModal: React.FC<EditReportModalProps> = ({
  report,
  isOpen,
  onClose,
  onSave,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<EditReportFormData>({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState<Partial<EditReportFormData>>({});
  const { toast } = useToast();

  // Reset form when report changes
  React.useEffect(() => {
    if (report) {
      setFormData({
        name: report.name,
        description: report.description || ''
      });
      setErrors({});
    }
  }, [report]);

  const validateForm = (data: EditReportFormData) => {
    try {
      editReportSchema.parse(data);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<EditReportFormData> = {};
        error.issues.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof EditReportFormData] = err.message;
          }
        });
        return fieldErrors;
      }
      return {};
    }
  };

  const handleSave = () => {
    const validationErrors = validateForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors below.",
        variant: "destructive"
      });
      return;
    }

    if (report) {
      onSave(report.id, formData);
      onClose();
      toast({
        title: "Report Updated",
        description: "Report details have been successfully updated."
      });
    }
  };

  const handleInputChange = (field: keyof EditReportFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Report Details</DialogTitle>
          <DialogDescription>
            Make changes to your report information. All fields are validated for security.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Report Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter report name"
              className={errors.name ? 'border-destructive' : ''}
              maxLength={100}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.name.length}/100 characters
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Add a description for this report (optional)"
              rows={3}
              className={errors.description ? 'border-destructive' : ''}
              maxLength={500}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {(formData.description || '').length}/500 characters
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !formData.name.trim()}>
            {isLoading ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Export types for external use
export type { 
  Report, 
  ReportCardProps, 
  ReportsListProps, 
  EditReportModalProps,
  EditReportFormData 
};