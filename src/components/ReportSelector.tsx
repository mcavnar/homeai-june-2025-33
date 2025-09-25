import React from "react";
import { FileText, Star, Plus, MapPin, Calendar, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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

interface ReportSelectorProps {
  variant?: 'full' | 'compact';
  reports?: Report[];
  selectedReportId?: string;
  onReportSelect?: (reportId: string) => void;
  onNewReport?: () => void;
  isLoading?: boolean;
  className?: string;
}

// Mock data for demonstration
const mockReports: Report[] = [
  {
    id: "1",
    name: "Main Street Property Inspection",
    address: "123 Main Street, Anytown, CA 90210",
    createdAt: new Date("2024-03-15"),
    issueCounts: { high: 3, medium: 8, low: 12 },
    isPrimary: true,
    status: 'completed'
  },
  {
    id: "2", 
    name: "Oak Avenue Duplex - Comprehensive Report",
    address: "456 Oak Avenue, Springfield, IL 62701",
    createdAt: new Date("2024-03-10"),
    issueCounts: { high: 1, medium: 5, low: 7 },
    isPrimary: false,
    status: 'completed'
  },
  {
    id: "3",
    name: "Pine Ridge Condo Unit 2B",
    address: "789 Pine Ridge Drive, Unit 2B, Boulder, CO 80301",
    createdAt: new Date("2024-03-08"),
    issueCounts: { high: 0, medium: 3, low: 4 },
    isPrimary: false,
    status: 'processing'
  }
];

// Helper function to format date
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

// Helper function to get status color
const getStatusColor = (status: Report['status']) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'processing': return 'bg-yellow-100 text-yellow-800';  
    case 'failed': return 'bg-red-100 text-red-800';
    default: return 'bg-muted text-muted-foreground';
  }
};

// Loading State Component
const LoadingState: React.FC<{ variant: 'full' | 'compact' }> = ({ variant }) => (
  <div className={cn("flex items-center gap-3", variant === 'compact' && "gap-2")}>
    <Skeleton className={cn("h-10 flex-1", variant === 'compact' && "h-8")} />
    <Skeleton className={cn("h-10 w-24", variant === 'compact' && "h-8 w-20")} />
  </div>
);

// Empty State Component
const EmptyState: React.FC<{ onNewReport?: () => void; variant: 'full' | 'compact' }> = ({ 
  onNewReport, 
  variant 
}) => (
  <div className="flex items-center justify-center p-8 bg-muted/30 rounded-lg border-2 border-dashed border-border">
    <div className="text-center space-y-3">
      <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
      <div>
        <p className="text-sm font-medium text-foreground">No reports yet</p>
        <p className="text-xs text-muted-foreground">Create your first inspection report</p>
      </div>
      <Button 
        onClick={onNewReport}
        size={variant === 'compact' ? 'sm' : 'default'}
        className="mt-3"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create First Report
      </Button>
    </div>
  </div>
);

// Single Report State Component  
const SingleReportState: React.FC<{ report: Report; onNewReport?: () => void; variant: 'full' | 'compact' }> = ({ 
  report, 
  onNewReport, 
  variant 
}) => (
  <div className="flex items-center gap-3">
    <div className="flex-1">
      <Badge variant="secondary" className="h-10 px-4 rounded-md justify-start">
        <FileText className="h-4 w-4 mr-2" />
        <span className="truncate font-medium">{report.name}</span>
        {report.isPrimary && <Star className="h-3 w-3 ml-2 fill-current text-yellow-500" />}
      </Badge>
    </div>
    <Button
      onClick={onNewReport}
      variant="outline"
      size={variant === 'compact' ? 'sm' : 'default'}
    >
      <Plus className="h-4 w-4 mr-2" />
      New Report
    </Button>
  </div>
);

// Report Item Component for dropdown
const ReportItem: React.FC<{ report: Report; variant: 'full' | 'compact' }> = ({ report, variant }) => {
  const totalIssues = report.issueCounts.high + report.issueCounts.medium + report.issueCounts.low;
  
  return (
    <div className="space-y-2 py-1">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="font-medium truncate">{report.name}</span>
          {report.isPrimary && (
            <Star className="h-3 w-3 fill-current text-yellow-500 flex-shrink-0" />
          )}
        </div>
        <Badge 
          variant="secondary" 
          className={cn("text-xs", getStatusColor(report.status))}
        >
          {report.status}
        </Badge>
      </div>
      
      {variant === 'full' && (
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{report.address}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(report.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-600">{report.issueCounts.high}H</span>
              <span className="text-orange-600">{report.issueCounts.medium}M</span>
              <span className="text-blue-600">{report.issueCounts.low}L</span>
              <span className="text-muted-foreground">({totalIssues} total)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Multiple Reports State Component
const MultipleReportsState: React.FC<{
  reports: Report[];
  selectedReportId?: string;
  onReportSelect?: (reportId: string) => void;
  onNewReport?: () => void;
  variant: 'full' | 'compact';
}> = ({ reports, selectedReportId, onReportSelect, onNewReport, variant }) => {
  const selectedReport = reports.find(r => r.id === selectedReportId) || reports[0];
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <Select value={selectedReportId || reports[0]?.id} onValueChange={onReportSelect}>
          <SelectTrigger className="h-10">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="truncate font-medium">
                {selectedReport?.name || 'Select a report'}
              </span>
              {selectedReport?.isPrimary && (
                <Star className="h-3 w-3 fill-current text-yellow-500 flex-shrink-0" />
              )}
            </div>
          </SelectTrigger>
          <SelectContent className="w-[400px]">
            {reports.map((report) => (
              <SelectItem key={report.id} value={report.id} className="p-3">
                <ReportItem report={report} variant={variant} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={onNewReport}
        variant="outline"
        size={variant === 'compact' ? 'sm' : 'default'}
      >
        <Plus className="h-4 w-4 mr-2" />
        New Report
      </Button>
    </div>
  );
};

// Main ReportSelector Component
export const ReportSelector: React.FC<ReportSelectorProps> = ({
  variant = 'full',
  reports = mockReports, // Use mock data by default
  selectedReportId,
  onReportSelect,
  onNewReport,
  isLoading = false,
  className
}) => {
  // Determine which state to render
  if (isLoading) {
    return (
      <div className={cn("w-full", className)}>
        <LoadingState variant={variant} />
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className={cn("w-full", className)}>
        <EmptyState onNewReport={onNewReport} variant={variant} />
      </div>
    );
  }

  if (reports.length === 1) {
    return (
      <div className={cn("w-full", className)}>
        <SingleReportState 
          report={reports[0]} 
          onNewReport={onNewReport} 
          variant={variant} 
        />
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <MultipleReportsState
        reports={reports}
        selectedReportId={selectedReportId}
        onReportSelect={onReportSelect}
        onNewReport={onNewReport}
        variant={variant}
      />
    </div>
  );
};

// Export both individual components and main component for flexibility
export { LoadingState, EmptyState, SingleReportState, MultipleReportsState };
export type { Report, ReportSelectorProps };