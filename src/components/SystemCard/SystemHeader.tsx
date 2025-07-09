
import React from 'react';

interface SystemHeaderProps {
  title: string;
  status: string;
}

const SystemHeader: React.FC<SystemHeaderProps> = ({ title, status }) => {
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'Good':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Fair':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  return (
    <div className="flex justify-between items-start mb-6">
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      </div>
      <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusClasses(status)}`}>
        {status}
      </span>
    </div>
  );
};

export default SystemHeader;
