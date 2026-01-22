import { ChevronLeft, Trash2, AlertTriangle, Eye, Paintbrush } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { CategoryType } from '@/data/mockReports';

export function ReportStep1() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);

  const categories = [
    { 
      id: 'Rubbish' as CategoryType,
      name: 'Rubbish',
      icon: Trash2,
      color: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
      iconColor: 'text-amber-600',
      selectedColor: 'bg-amber-500 text-white border-amber-500'
    },
    { 
      id: 'Unsafe Area' as CategoryType,
      name: 'Unsafe Area',
      icon: AlertTriangle,
      color: 'bg-red-50 border-red-200 hover:bg-red-100',
      iconColor: 'text-red-600',
      selectedColor: 'bg-red-500 text-white border-red-500'
    },
    { 
      id: 'Suspicious Activity' as CategoryType,
      name: 'Suspicious Activity',
      icon: Eye,
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      iconColor: 'text-purple-600',
      selectedColor: 'bg-purple-500 text-white border-purple-500'
    },
    { 
      id: 'Vandalism' as CategoryType,
      name: 'Vandalism',
      icon: Paintbrush,
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      iconColor: 'text-orange-600',
      selectedColor: 'bg-orange-500 text-white border-orange-500'
    },
  ];

  const handleContinue = () => {
    if (selectedCategory) {
      navigate('/report/step2', { state: { category: selectedCategory } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 ml-2">Report Issue</h1>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-md mx-auto px-4 pb-4">
          <div className="flex gap-2">
            <div className="flex-1 h-1 bg-blue-600 rounded-full" />
            <div className="flex-1 h-1 bg-gray-200 rounded-full" />
            <div className="flex-1 h-1 bg-gray-200 rounded-full" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Step 1 of 3</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            What are you reporting?
          </h2>
          <p className="text-gray-600">
            Select the category that best describes the issue
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  isSelected 
                    ? category.selectedColor 
                    : `${category.color} border-2`
                }`}
              >
                <Icon className={`h-10 w-10 mb-3 ${isSelected ? 'text-white' : category.iconColor}`} />
                <h3 className={`font-medium text-left ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  {category.name}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedCategory}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
            selectedCategory
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
