import { ChevronLeft, MapPin, UserX } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Switch } from '@/app/components/ui/switch';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { apiService, handleApiError } from '@/services/api';

export function ReportStep3() {
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.state?.category;
  const media = location.state?.media;
  
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      // Get current location (mock for now - in real app would use geolocation API)
      const latitude = 9.4034 + (Math.random() - 0.5) * 0.01; // Tamale area with small random offset
      const longitude = -0.8424 + (Math.random() - 0.5) * 0.01;
      const locationName = useCurrentLocation ? 'Current Location, Tamale' : 'Custom Location';

      const reportData = {
        category,
        latitude,
        longitude,
        location: locationName,
        description: description || undefined,
        severity: 'MEDIUM' as const,
        // media: media ? [media] : undefined // TODO: Handle actual file uploads
      };

      const response = await apiService.submitReport(reportData);
      
      // Navigate to success screen with the report ID
      navigate('/report/success', { 
        state: { 
          reportId: response.reportId,
          message: response.message
        } 
      });

    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Failed to submit report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const handleSubmit = async () => {
    if (!category) {
      setError('Missing report category');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Get location
      let coordinates;
      if (useCurrentLocation) {
        coordinates = await getCurrentLocation();
      } else {
        // For demo, use Tamale coordinates
        coordinates = { lat: 9.4034, lng: -0.8424 };
      }

      // Prepare report data
      const reportData: ReportFormData = {
        type: mapCategoryToType(category),
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        location: useCurrentLocation ? 'Current Location' : 'Selected Location',
        description: description || undefined,
        severity: 'MEDIUM', // Default severity
        // TODO: Add actual media files when camera integration is ready
        media: undefined
      };

      // Submit report
      const result = await apiService.submitReport(reportData);
      
      // Navigate to success screen
      navigate('/report/success', { 
        state: { 
          reportId: result.reportId,
          category, 
          media, 
          description, 
          isAnonymous, 
          useCurrentLocation 
        } 
      });
    } catch (err) {
      console.error('Error submitting report:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={() => navigate('/report/step2', { state: { category } })}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isSubmitting}
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 ml-2">Details</h1>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-md mx-auto px-4 pb-4">
          <div className="flex gap-2">
            <div className="flex-1 h-1 bg-blue-600 rounded-full" />
            <div className="flex-1 h-1 bg-blue-600 rounded-full" />
            <div className="flex-1 h-1 bg-blue-600 rounded-full" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Step 3 of 3</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Add Details
          </h2>
          <p className="text-gray-600">
            Help us understand the situation better
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6 mb-8">
          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-base font-medium text-gray-900 mb-2 block">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what you're reporting..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] rounded-2xl border-gray-300 focus:border-blue-600 focus:ring-blue-600 resize-none"
              maxLength={500}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-2 text-right">
              {description.length}/500 characters
            </p>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Location</h3>
                  <p className="text-sm text-gray-500">
                    {useCurrentLocation ? 'Current location' : 'Custom location'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Use my current location</span>
              <Switch
                checked={useCurrentLocation}
                onCheckedChange={setUseCurrentLocation}
                disabled={isSubmitting}
              />
            </div>

            {!useCurrentLocation && (
              <button 
                className="w-full mt-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                Select on Map
              </button>
            )}
          </div>

          {/* Anonymous Toggle */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-purple-50 rounded-xl">
                  <UserX className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Submit Anonymously</h3>
                  <p className="text-sm text-gray-500">Hide your identity</p>
                </div>
              </div>
              <Switch
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
            isSubmitting
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md active:scale-98'
          }`}
        >
          {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
        </button>
      </div>
    </div>
  );
}
