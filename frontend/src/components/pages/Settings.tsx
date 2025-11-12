import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Mail, 
  Globe, 
  Palette,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Smartphone,
  Calendar,
  Database
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface UserSettings {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    department: string;
    position: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    applicationUpdates: boolean;
    interviewReminders: boolean;
    weeklyReports: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'internal' | 'private';
    showEmail: boolean;
    showPhone: boolean;
  };
  preferences: {
    timezone: string;
    dateFormat: string;
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'preferences'>('profile');
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      firstName: user?.username || '',
      lastName: '',
      email: user?.email || '',
      phone: '+1 (555) 123-4567',
      department: 'Human Resources',
      position: 'HR Manager'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      applicationUpdates: true,
      interviewReminders: true,
      weeklyReports: false
    },
    privacy: {
      profileVisibility: 'internal',
      showEmail: true,
      showPhone: false
    },
    preferences: {
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      theme: 'light',
      language: 'en'
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSaveSettings = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      
      // Reset saved status after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const updateSetting = (category: keyof UserSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon }
  ] as const;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and system settings</p>
        </div>
        
        <button
          onClick={handleSaveSettings}
          disabled={loading}
          className={`workday-button-primary flex items-center space-x-2 ${
            saved ? 'bg-green-600 hover:bg-green-700' : ''
          }`}
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <>
              <Save className="h-4 w-4" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors duration-150 ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="workday-card">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="workday-card-header">
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  <p className="text-sm text-gray-500">Update your personal and professional details</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={settings.profile.firstName}
                      onChange={(e) => updateSetting('profile', 'firstName', e.target.value)}
                      className="workday-input"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={settings.profile.lastName}
                      onChange={(e) => updateSetting('profile', 'lastName', e.target.value)}
                      className="workday-input"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                        className="workday-input pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Smartphone className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        value={settings.profile.phone}
                        onChange={(e) => updateSetting('profile', 'phone', e.target.value)}
                        className="workday-input pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={settings.profile.department}
                      onChange={(e) => updateSetting('profile', 'department', e.target.value)}
                      className="workday-input"
                    >
                      <option value="Human Resources">Human Resources</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Product">Product</option>
                      <option value="Design">Design</option>
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      value={settings.profile.position}
                      onChange={(e) => updateSetting('profile', 'position', e.target.value)}
                      className="workday-input"
                    />
                  </div>
                </div>
                
                {/* Password Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="workday-input pr-10"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="workday-input"
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="workday-card-header">
                  <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                  <p className="text-sm text-gray-500">Choose how you want to be notified about updates</p>
                </div>
                
                <div className="space-y-4">
                  {Object.entries({
                    emailNotifications: 'Email Notifications',
                    pushNotifications: 'Push Notifications',
                    applicationUpdates: 'New Application Alerts',
                    interviewReminders: 'Interview Reminders',
                    weeklyReports: 'Weekly Summary Reports'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{label}</h4>
                        <p className="text-sm text-gray-500">
                          {key === 'emailNotifications' && 'Receive notifications via email'}
                          {key === 'pushNotifications' && 'Browser and mobile push notifications'}
                          {key === 'applicationUpdates' && 'Get notified when new applications are submitted'}
                          {key === 'interviewReminders' && 'Reminders for upcoming interviews'}
                          {key === 'weeklyReports' && 'Weekly recruitment performance summaries'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications[key as keyof typeof settings.notifications]}
                          onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="workday-card-header">
                  <h2 className="text-xl font-semibold text-gray-900">Privacy Settings</h2>
                  <p className="text-sm text-gray-500">Control your profile visibility and data sharing</p>
                </div>
                
                <div className="space-y-6">
                  {/* Profile Visibility */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Profile Visibility
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'public', label: 'Public', desc: 'Visible to everyone' },
                        { value: 'internal', label: 'Internal Only', desc: 'Visible to company members only' },
                        { value: 'private', label: 'Private', desc: 'Only visible to you' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="visibility"
                            value={option.value}
                            checked={settings.privacy.profileVisibility === option.value}
                            onChange={(e) => updateSetting('privacy', 'profileVisibility', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{option.label}</p>
                            <p className="text-sm text-gray-500">{option.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Contact Information Visibility</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Show email address</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.privacy.showEmail}
                            onChange={(e) => updateSetting('privacy', 'showEmail', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Show phone number</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.privacy.showPhone}
                            onChange={(e) => updateSetting('privacy', 'showPhone', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div className="workday-card-header">
                  <h2 className="text-xl font-semibold text-gray-900">System Preferences</h2>
                  <p className="text-sm text-gray-500">Customize your system experience</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Globe className="h-4 w-4 inline mr-2" />
                      Timezone
                    </label>
                    <select
                      value={settings.preferences.timezone}
                      onChange={(e) => updateSetting('preferences', 'timezone', e.target.value)}
                      className="workday-input"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Date Format
                    </label>
                    <select
                      value={settings.preferences.dateFormat}
                      onChange={(e) => updateSetting('preferences', 'dateFormat', e.target.value)}
                      className="workday-input"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Palette className="h-4 w-4 inline mr-2" />
                      Theme
                    </label>
                    <select
                      value={settings.preferences.theme}
                      onChange={(e) => updateSetting('preferences', 'theme', e.target.value)}
                      className="workday-input"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Globe className="h-4 w-4 inline mr-2" />
                      Language
                    </label>
                    <select
                      value={settings.preferences.language}
                      onChange={(e) => updateSetting('preferences', 'language', e.target.value)}
                      className="workday-input"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>
                
                {/* System Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    System Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Version:</span>
                      <span className="text-sm font-medium">v2.1.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Updated:</span>
                      <span className="text-sm font-medium">November 10, 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">User ID:</span>
                      <span className="text-sm font-medium">{user?.id || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;