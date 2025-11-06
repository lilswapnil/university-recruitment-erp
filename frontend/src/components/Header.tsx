import React, { useState } from 'react';
import { Menu, Search, Filter, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  user: {
    username: string;
    role: string;
  };
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const { logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white h-14 fixed top-0 left-16 right-0 flex items-center justify-between px-4 shadow-sm z-10">
      {/* Left side - Hamburger menu */}
      <button className="p-1.5 hover:bg-gray-100 rounded-lg">
        <Menu size={20} className="text-gray-700" />
      </button>

      {/* Right side - Search, Filter, Notifications, Profile */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="p-1.5 hover:bg-gray-100 rounded-lg">
          <Search size={18} className="text-gray-700" />
        </button>

        {/* Filter */}
        <button className="p-1.5 hover:bg-gray-100 rounded-lg">
          <Filter size={18} className="text-gray-700" />
        </button>

        {/* Notifications */}
        <button className="p-1.5 hover:bg-gray-100 rounded-lg relative">
          <Bell size={18} className="text-gray-700" />
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center cursor-pointer"
          >
            <User size={16} className="text-white" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
              <div className="px-3 py-2 border-b border-gray-200">
                <p className="text-xs font-medium text-gray-800">{user.username}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

