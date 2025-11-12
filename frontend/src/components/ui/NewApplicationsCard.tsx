import React from 'react';
import { Application } from '../../types';

interface NewApplicationsCardProps {
  applications: Application[];
  onViewAll?: () => void;
}

const NewApplicationsCard: React.FC<NewApplicationsCardProps> = ({ applications, onViewAll }) => {
  const recentApplications = applications.slice(0, 3);
  
  const getPriorityColor = (status: string) => {
    if (status === 'Interview' || status === 'Offer Extended') {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-green-100 text-green-800';
  };

  const getPriorityLabel = (status: string) => {
    if (status === 'Interview' || status === 'Offer Extended') {
      return 'High priority';
    }
    return 'Low priority';
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="text-base font-bold text-gray-800 mb-3">New applications</h3>
      
      <div className="space-y-3">
        {recentApplications.length === 0 ? (
          <p className="text-xs text-gray-500">No new applications</p>
        ) : (
          recentApplications.map((app) => (
            <div key={app.id} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                {app.candidate_name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-800">{app.job_title}</p>
                <p className="text-xs text-gray-500">By {app.candidate_name}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(app.status)}`}>
                {getPriorityLabel(app.status)}
              </span>
            </div>
          ))
        )}
      </div>
      
      <button
        onClick={() => onViewAll?.()}
        className="text-xs text-purple-600 hover:text-purple-700 mt-3 inline-block cursor-pointer bg-transparent border-none p-0"
        type="button"
      >
        View all applications →
      </button>
    </div>
  );
};

export default NewApplicationsCard;

