// API service for React Native
const API_BASE = __DEV__ ? 'http://192.168.108.232:3001' : 'https://your-production-api.com'; // Your laptop's IP for ethernet connection

export interface ReportFormData {
  category: string;
  latitude: number;
  longitude: number;
  location: string;
  description?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  media?: string[]; // Base64 encoded images or file URIs
}

export interface Report {
  id: string;
  anonymousId: string;
  type: string;
  severity: string;
  latitude: number;
  longitude: number;
  location: string;
  description?: string;
  mediaUrls: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  responseTime?: number;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Remove Content-Type for FormData
    if (options.body instanceof FormData) {
      delete (config.headers as any)['Content-Type'];
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Submit new report
  async submitReport(reportData: ReportFormData): Promise<{ reportId: string; message: string }> {
    const formData = new FormData();
    
    formData.append('category', reportData.category);
    formData.append('latitude', reportData.latitude.toString());
    formData.append('longitude', reportData.longitude.toString());
    formData.append('location', reportData.location);
    
    if (reportData.description) {
      formData.append('description', reportData.description);
    }
    
    if (reportData.severity) {
      formData.append('severity', reportData.severity);
    }

    // Add media files (for React Native, these would be file URIs)
    if (reportData.media && reportData.media.length > 0) {
      reportData.media.forEach((mediaUri, index) => {
        formData.append('media', {
          uri: mediaUri,
          type: 'image/jpeg',
          name: `image_${index}.jpg`,
        } as any);
      });
    }

    return this.request<{ reportId: string; message: string }>('/api/reports', {
      method: 'POST',
      body: formData,
    });
  }

  // Get reports with filters
  async getReports(filters?: {
    status?: string;
    type?: string;
    severity?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ reports: Report[]; total: number; hasMore: boolean }> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const endpoint = `/api/reports${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{ reports: Report[]; total: number; hasMore: boolean }>(endpoint);
  }

  // Get single report
  async getReport(id: string): Promise<Report> {
    return this.request<Report>(`/api/reports/${id}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

// Police API Service (for future police dashboard mobile app)
export class PoliceApiService extends ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private getAuthHeaders(): Record<string, string> {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  // Police login
  async login(badgeId: string, password: string): Promise<{
    success: boolean;
    token: string;
    user: {
      id: string;
      badgeId: string;
      name: string;
      station: string;
    };
  }> {
    const response = await this.request<{
      success: boolean;
      token: string;
      user: {
        id: string;
        badgeId: string;
        name: string;
        station: string;
      };
    }>('/api/police/login', {
      method: 'POST',
      body: JSON.stringify({ badgeId, password }),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  // Update report status
  async updateReportStatus(
    reportId: string,
    status: string,
    internalNotes?: string
  ): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      `/api/police/reports/${reportId}/status`,
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status, internalNotes }),
      }
    );
  }
}

// Export singleton instances
export const apiService = new ApiService();
export const policeApiService = new PoliceApiService();

// Utility functions
export const handleApiError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const isNetworkError = (error: any): boolean => {
  return error instanceof TypeError && error.message.includes('fetch');
};