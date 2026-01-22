import { Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiService, type Report } from '@/services/api';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Badge } from '@/app/components/ui/badge';

type CategoryType = 'RUBBISH' | 'UNSAFE_AREA' | 'SUSPICIOUS_ACTIVITY' | 'VANDALISM';

export function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'All'>('All');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories: (CategoryType | 'All')[] = ['All', 'RUBBISH', 'UNSAFE_AREA', 'SUSPICIOUS_ACTIVITY', 'VANDALISM'];
  
  // Map backend types to display names
  const getCategoryDisplayName = (category: CategoryType | 'All') => {
    switch (category) {
      case 'RUBBISH': return 'Rubbish';
      case 'UNSAFE_AREA': return 'Unsafe Area';
      case 'SUSPICIOUS_ACTIVITY': return 'Suspicious Activity';
      case 'VANDALISM': return 'Vandalism';
      default: return category;
    }
  };

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const filters = selectedCategory === 'All' ? {} : { type: selectedCategory };
        const response = await apiService.getReports(filters);
        setReports(response.reports);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
        setError('Failed to load reports');
        // Keep empty array on error
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [selectedCategory]);

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'RUBBISH':
        return 'bg-amber-100 text-amber-800';
      case 'UNSAFE_AREA':
        return 'bg-red-100 text-red-800';
      case 'SUSPICIOUS_ACTIVITY':
        return 'bg-purple-100 text-purple-800';
      case 'VANDALISM':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">SeeIt</h1>
            <p className="text-sm text-gray-500">Community Reports</p>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Filter className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="max-w-md mx-auto px-4 pb-3 overflow-x-auto flex gap-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getCategoryDisplayName(category)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading reports...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
              <p className="text-red-800">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Report List */}
        {!loading && !error && reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Image */}
            <div className="relative aspect-video bg-gray-200">
              {report.mediaUrls && report.mediaUrls.length > 0 ? (
                <ImageWithFallback
                  src={report.mediaUrls[0]}
                  alt={getCategoryDisplayName(report.type as CategoryType)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              <Badge className={`absolute top-3 left-3 ${getCategoryColor(report.type)}`}>
                {getCategoryDisplayName(report.type as CategoryType)}
              </Badge>
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{report.location}</h3>
                  {report.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{report.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-500">{formatTimestamp(report.createdAt)}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    report.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                    report.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status.replace('_', ' ')}
                  </span>
                  <button className="text-xs text-blue-600 font-medium hover:text-blue-700">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {!loading && !error && reports.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No reports found for this category</p>
            <p className="text-sm text-gray-400 mt-1">Be the first to report an issue!</p>
          </div>
        )}
      </div>
    </div>
  );
}