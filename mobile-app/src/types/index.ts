export type CategoryType = 'RUBBISH' | 'UNSAFE_AREA' | 'SUSPICIOUS_ACTIVITY' | 'VANDALISM';

export type SeverityType = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type StatusType = 'SUBMITTED' | 'REVIEWING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export interface Report {
  id: string;
  anonymousId: string;
  type: CategoryType;
  severity: SeverityType;
  latitude: number;
  longitude: number;
  location: string;
  description?: string;
  mediaUrls: string[];
  status: StatusType;
  createdAt: string;
  updatedAt: string;
  responseTime?: number;
}

export interface ReportFormData {
  category: string;
  latitude: number;
  longitude: number;
  location: string;
  description?: string;
  severity?: SeverityType;
  media?: string[];
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface MediaItem {
  uri: string;
  type: 'image' | 'video';
  name?: string;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Map: undefined;
  Profile: undefined;
  ReportStep1: undefined;
  ReportStep2: { category: string };
  ReportStep3: { category: string; media?: MediaItem[] };
  ReportSuccess: { reportId: string; message: string };
};

// Category mapping utilities
export const getCategoryDisplayName = (category: CategoryType | string): string => {
  switch (category) {
    case 'RUBBISH': return 'Rubbish';
    case 'UNSAFE_AREA': return 'Unsafe Area';
    case 'SUSPICIOUS_ACTIVITY': return 'Suspicious Activity';
    case 'VANDALISM': return 'Vandalism';
    default: return category;
  }
};

export const getCategoryColor = (category: CategoryType | string): string => {
  switch (category) {
    case 'RUBBISH': return '#f59e0b'; // amber
    case 'UNSAFE_AREA': return '#ef4444'; // red
    case 'SUSPICIOUS_ACTIVITY': return '#8b5cf6'; // purple
    case 'VANDALISM': return '#f97316'; // orange
    default: return '#6b7280'; // gray
  }
};

export const getStatusColor = (status: StatusType | string): string => {
  switch (status) {
    case 'SUBMITTED': return '#f59e0b'; // amber
    case 'REVIEWING': return '#3b82f6'; // blue
    case 'IN_PROGRESS': return '#8b5cf6'; // purple
    case 'RESOLVED': return '#10b981'; // green
    case 'REJECTED': return '#ef4444'; // red
    default: return '#6b7280'; // gray
  }
};