import { User, Settings, Bell, HelpCircle, LogOut } from 'lucide-react';

export function ProfileScreen() {
  const menuItems = [
    { icon: User, label: 'My Profile', color: 'text-blue-600' },
    { icon: Bell, label: 'Notifications', color: 'text-purple-600' },
    { icon: Settings, label: 'Settings', color: 'text-gray-600' },
    { icon: HelpCircle, label: 'Help & Support', color: 'text-green-600' },
    { icon: LogOut, label: 'Sign Out', color: 'text-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        {/* User Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">John Doe</h2>
              <p className="text-sm text-gray-500">Active Reporter</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-900">12</p>
              <p className="text-xs text-gray-500">Reports</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-900">8</p>
              <p className="text-xs text-gray-500">Resolved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-900">4</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <Icon className={`h-5 w-5 ${item.color}`} />
                <span className="flex-1 text-left text-gray-900 font-medium">
                  {item.label}
                </span>
                <span className="text-gray-400">›</span>
              </button>
            );
          })}
        </div>

        {/* Version */}
        <p className="text-center text-xs text-gray-400 mt-8">
          SeeIt v1.0.0
        </p>
      </div>
    </div>
  );
}
