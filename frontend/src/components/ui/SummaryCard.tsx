import React from 'react';
import { TrendingUp, CheckCircle } from 'lucide-react';

interface SummaryCardProps {
  totalDelivered: number;
  growthPercent: number;
  target: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ totalDelivered, growthPercent, target }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="text-base font-bold text-gray-800 mb-3">Summary</h3>
      
      <div className="mb-4">
        <p className="text-3xl font-bold text-gray-800">{totalDelivered.toLocaleString()}</p>
        <p className="text-xs text-gray-500 mt-1">Total hired (last 30 days)</p>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-green-500" size={16} />
          <p className="text-xs text-gray-700">
            You have a {growthPercent}% growth in comparison with previous month
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <CheckCircle className="text-purple-500" size={16} />
          <p className="text-xs text-gray-700">
            Your target for this month is {target.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;

