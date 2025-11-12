import React from 'react';
import { 
  Users, 
  Briefcase, 
  FileText, 
  BarChart3, 
  Settings, 
  User,
  Building2,
  UserCheck,
  ClipboardList,
  Target,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  userRole: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, userRole, isOpen = false, onClose }) => {
  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 }
    ];

    switch (userRole) {
      case 'HR':
        return [
          ...commonItems,
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          { id: 'jobs', label: 'Job Openings', icon: Briefcase },
          { id: 'candidates', label: 'Talent Pool', icon: Users },
          { id: 'applications', label: 'Applications', icon: FileText },
          { id: 'interviews', label: 'Interviews', icon: Calendar },
          { id: 'reporting', label: 'Reports', icon: ClipboardList },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];
      case 'MANAGER':
        return [
          ...commonItems,
          { id: 'team-analytics', label: 'Team Analytics', icon: TrendingUp },
          { id: 'jobs', label: 'My Openings', icon: Briefcase },
          { id: 'applications', label: 'Applications', icon: FileText },
          { id: 'interviews', label: 'Interviews', icon: Calendar },
          { id: 'team', label: 'My Team', icon: UserCheck }
        ];
      case 'CANDIDATE':
        return [
          ...commonItems,
          { id: 'profile', label: 'My Profile', icon: User },
          { id: 'job-search', label: 'Job Search', icon: Target },
          { id: 'applications', label: 'My Applications', icon: FileText },
          { id: 'interviews', label: 'Interviews', icon: Calendar }
        ];
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  const handleItemClick = (itemId: string) => {
    onViewChange(itemId);
    if (onClose && window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <div className={`workday-sidebar ${isOpen ? 'open' : ''}`}>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">UniRecruit</h1>
            <p className="text-sm text-gray-300 font-medium">ERP System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25 transform scale-[1.02]'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/60 hover:transform hover:scale-[1.01]'
              }`}
            >
              <Icon className={`h-5 w-5 transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Role Badge */}
      <div className="absolute bottom-6 left-4 right-4">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-600 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white leading-tight">
                {userRole === 'HR' ? 'HR Specialist' : 
                 userRole === 'MANAGER' ? 'Department Manager' : 'Candidate'}
              </p>
              <p className="text-xs text-gray-300 mt-0.5">
                {userRole === 'HR' ? 'Full Access' : 
                 userRole === 'MANAGER' ? 'Department Access' : 'Profile Access'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

