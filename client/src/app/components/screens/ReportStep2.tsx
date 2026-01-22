import { ChevronLeft, Camera, Video, Image as ImageIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export function ReportStep2() {
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.state?.category;
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const mediaOptions = [
    {
      id: 'camera',
      name: 'Take Photo',
      icon: Camera,
      color: 'bg-blue-50 hover:bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      id: 'video',
      name: 'Record Video',
      icon: Video,
      color: 'bg-green-50 hover:bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      id: 'gallery',
      name: 'Choose from Gallery',
      icon: ImageIcon,
      color: 'bg-purple-50 hover:bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  const handleContinue = () => {
    navigate('/report/step3', { state: { category, media: selectedFile } });
  };

  const handleSkip = () => {
    navigate('/report/step3', { state: { category, media: null } });
  };

  const handleMediaSelect = (id: string) => {
    // In a real app, this would open the camera/gallery
    setSelectedFile(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/report')}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 ml-2">Add Media</h1>
          </div>
          <button
            onClick={handleSkip}
            className="text-sm text-blue-600 font-medium hover:text-blue-700"
          >
            Skip
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-md mx-auto px-4 pb-4">
          <div className="flex gap-2">
            <div className="flex-1 h-1 bg-blue-600 rounded-full" />
            <div className="flex-1 h-1 bg-blue-600 rounded-full" />
            <div className="flex-1 h-1 bg-gray-200 rounded-full" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Step 2 of 3</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Add Photo or Video
          </h2>
          <p className="text-gray-600">
            Visual evidence helps us respond faster
          </p>
        </div>

        {/* Media Options */}
        <div className="space-y-4 mb-8">
          {mediaOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedFile === option.id;

            return (
              <button
                key={option.id}
                onClick={() => handleMediaSelect(option.id)}
                className={`w-full p-6 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${option.color}`}
              >
                <div className={`p-3 rounded-xl ${option.color}`}>
                  <Icon className={`h-6 w-6 ${option.iconColor}`} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">{option.name}</h3>
                </div>
                {isSelected && (
                  <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8">
          <h4 className="font-medium text-blue-900 mb-2">Media Guidelines</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Videos: Maximum 30 seconds</li>
            <li>• File size: 15MB maximum</li>
            <li>• Clear, well-lit photos work best</li>
          </ul>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedFile}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
            selectedFile
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md active:scale-98'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
