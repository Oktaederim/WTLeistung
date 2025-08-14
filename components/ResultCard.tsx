
import React from 'react';

interface ResultCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  colorClass: string;
  tooltip?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ icon, label, value, unit, colorClass, tooltip }) => {
  return (
    <div className="relative flex flex-col p-4 bg-white border border-gray-200 rounded-lg shadow-sm group">
      <div className={`absolute top-0 right-0 p-3 -mt-4 -mr-2 text-white rounded-full shadow-lg ${colorClass}`}>
        {icon}
      </div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="flex items-baseline mt-1">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className="ml-1 text-sm font-medium text-gray-500">{unit}</p>
      </div>
       {tooltip && (
            <div className="absolute left-0 bottom-full mb-2 w-max max-w-xs p-2 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                {tooltip}
            </div>
        )}
    </div>
  );
};
