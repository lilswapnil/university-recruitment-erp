import React from 'react';
import { Home, Settings, Users, Briefcase, FileText, BarChart3 } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  userRole: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, userRole }) => {
  // Role-based menu items
  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', icon: Home, label: 'Dashboard' },
      { id: 'jobs', icon: Briefcase, label: 'Jobs' },
      { id: 'applications', icon: FileText, label: 'Applications' },
    ];

    if (userRole === 'HR' || userRole === 'MANAGER') {
      return [
        ...baseItems,
        { id: 'candidates', icon: Users, label: 'Candidates' },
        { id: 'reports', icon: BarChart3, label: 'Reports' },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-16 bg-gray-100 h-screen fixed left-0 top-0 flex flex-col items-center py-3">
      {/* Logo */}
      <div className="mb-6">
        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
          <Briefcase className="text-white" size={20} />
        </div>
      </div>

      {/* Navigation Icons */}
      <nav className="flex flex-col gap-2 w-full items-center">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              title={item.label}
            >
              <Icon size={18} />
            </button>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="mt-auto">
        <button
          onClick={() => onViewChange('settings')}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
            activeView === 'settings'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
          title="Settings"
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

