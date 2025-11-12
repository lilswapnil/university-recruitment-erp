import React from 'react';
import { FileText, Bell } from 'lucide-react';

interface WelcomeCardProps {
  userName: string;
  newApplications: number;
  notifications: number;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ userName, newApplications, notifications }) => {
  return (
    <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-6 relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Hello, {userName}!</h2>
        <p className="text-xs text-gray-600 mb-4">Here is your recruitment summary</p>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <FileText className="text-purple-600" size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-600">New applications</p>
              <p className="text-lg font-bold text-gray-800">{newApplications}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Bell className="text-purple-600" size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-600">Notifications</p>
              <p className="text-lg font-bold text-gray-800">{notifications}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative illustration */}
      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="30" cy="30" r="8" fill="currentColor" className="text-purple-600" />
          <circle cx="70" cy="30" r="8" fill="currentColor" className="text-purple-600" />
          <circle cx="50" cy="60" r="8" fill="currentColor" className="text-purple-600" />
          <circle cx="20" cy="70" r="6" fill="currentColor" className="text-purple-600" />
        </svg>
      </div>
    </div>
  );
};

export default WelcomeCard;

