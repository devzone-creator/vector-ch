import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiService, type Report } from '@/services/api';
import { Badge } from '@/app/components/ui/badge';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export function MapScreen() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultCenter: [number, number] = [9.4034, -0.8424]; // Tamale, Ghana

  // Fetch reports on component mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await apiService.getReports();
        setReports(response.reports);
      } catch (error) {
        console.error('Failed to fetch reports for map:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getCategoryDisplayName = (type: string) => {
    switch (type) {
      case 'RUBBISH': return 'Rubbish';
      case 'UNSAFE_AREA': return 'Unsafe Area';
      case 'SUSPICIOUS_ACTIVITY': return 'Suspicious Activity';
      case 'VANDALISM': return 'Vandalism';
      default: return type;
    }
  };

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

  return (
    <div className="h-screen bg-gray-100 pb-16">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-white shadow-md">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Map View</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Filter className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="h-full pt-16">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {reports.map((report) => {
            if (!report.latitude || !report.longitude) return null;
            
            return (
              <Marker
                key={report.id}
                position={[report.latitude, report.longitude]}
                eventHandlers={{
                  click: () => setSelectedReport(report),
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <Badge className={getCategoryColor(report.type)}>
                      {getCategoryDisplayName(report.type)}
                    </Badge>
                    <p className="font-medium mt-2">{report.location}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Bottom Preview Card */}
      {selectedReport && (
        <div className="fixed bottom-20 left-0 right-0 z-[1000] px-4 pb-4">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-start gap-3 p-4">
              {/* Thumbnail */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                {selectedReport.mediaUrls && selectedReport.mediaUrls.length > 0 ? (
                  <ImageWithFallback
                    src={selectedReport.mediaUrls[0]}
                    alt={getCategoryDisplayName(selectedReport.type)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                )}
                <Badge className={`absolute top-2 left-2 text-xs ${getCategoryColor(selectedReport.type)}`}>
                  {getCategoryDisplayName(selectedReport.type)}
                </Badge>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {selectedReport.location}
                </h3>
                {selectedReport.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {selectedReport.description}
                  </p>
                )}
                <button className="text-sm text-blue-600 font-medium mt-2 hover:text-blue-700">
                  View Details →
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
