import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  subtitle?: string;
  onClick?: () => void;
  loading?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color = 'blue',
  subtitle,
  onClick,
  loading = false
}) => {
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; icon: string; text: string }> = {
      blue: {
        bg: 'bg-blue-50',
        icon: 'bg-blue-500 text-white',
        text: 'text-blue-600'
      },
      green: {
        bg: 'bg-green-50',
        icon: 'bg-green-500 text-white',
        text: 'text-green-600'
      },
      purple: {
        bg: 'bg-purple-50',
        icon: 'bg-purple-500 text-white',
        text: 'text-purple-600'
      },
      orange: {
        bg: 'bg-orange-50',
        icon: 'bg-orange-500 text-white',
        text: 'text-orange-600'
      },
      red: {
        bg: 'bg-red-50',
        icon: 'bg-red-500 text-white',
        text: 'text-red-600'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  const colors = getColorClasses(color);

  if (loading) {
    return (
      <div className="workday-card animate-pulse">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          <div className="ml-4 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`workday-card transition-all duration-200 hover:shadow-md ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors.icon}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              {title}
            </h3>
            <div className="mt-1">
              <p className="text-2xl font-semibold text-gray-900">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </div>

        {change && (
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              change.type === 'increase' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {change.type === 'increase' ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{change.value}%</span>
            </div>
          </div>
        )}
      </div>

      {change && (
        <div className="mt-4 text-xs text-gray-500">
          vs {change.period}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;