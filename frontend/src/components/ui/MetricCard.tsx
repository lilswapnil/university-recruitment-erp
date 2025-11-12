import React from 'react';
import { TrendingUp, TrendingDown, Settings } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  change: number;
  color: 'green' | 'blue';
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, change, color }) => {
  const isPositive = change > 0;
  const bgColor = color === 'green' ? 'bg-green-500' : 'bg-blue-500';
  
  return (
    <div className={`${bgColor} rounded-xl p-6 text-white`}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
          <Settings size={18} />
        </div>
      </div>
      <p className="text-xs opacity-90 mb-1">{label}</p>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <div className="flex items-center gap-1">
        {isPositive ? (
          <TrendingUp size={14} />
        ) : (
          <TrendingDown size={14} />
        )}
        <span className="text-xs">{isPositive ? '+' : ''}{change.toFixed(2)}%</span>
      </div>
    </div>
  );
};

export default MetricCard;

