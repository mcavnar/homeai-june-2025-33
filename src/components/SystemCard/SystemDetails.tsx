
import React from 'react';
import { formatCurrency } from '@/utils/formatters';

interface SystemDetailsProps {
  description?: string;
  repairCost?: {
    min: number;
    max: number;
  };
  maintenanceTips?: string[];
  maintenanceCosts?: {
    fiveYear: {
      min: number;
      max: number;
    };
    tenYear: {
      min: number;
      max: number;
    };
  };
  anticipatedRepairs?: {
    fiveYear: string[];
    tenYear: string[];
  };
}

const SystemDetails: React.FC<SystemDetailsProps> = ({
  description,
  repairCost,
  maintenanceTips,
  maintenanceCosts,
  anticipatedRepairs
}) => {
  return (
    <div className="space-y-4 border-t border-gray-100 pt-4">
      {/* Description */}
      {description && (
        <div>
          <h5 className="font-semibold text-gray-900 mb-2 text-sm">Overview</h5>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
      )}

      {/* Repair Costs */}
      {repairCost && (
        <div>
          <h5 className="font-semibold text-gray-900 mb-2 text-sm">Estimated Repair Costs</h5>
          <p className="text-sm text-gray-900 font-medium">
            {formatCurrency(repairCost.min)} - {formatCurrency(repairCost.max)}
          </p>
        </div>
      )}

      {/* Maintenance Tips */}
      {maintenanceTips && maintenanceTips.length > 0 && (
        <div>
          <h5 className="font-semibold text-gray-900 mb-2 text-sm">Maintenance Tips</h5>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {maintenanceTips.map((tip, index) => (
              <li key={index} className="text-sm leading-relaxed">{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 5-Year Projections */}
      {(maintenanceCosts?.fiveYear || anticipatedRepairs?.fiveYear) && (
        <div>
          <h5 className="font-semibold text-gray-900 mb-2 text-sm">5-Year Projections</h5>
          {maintenanceCosts?.fiveYear && (
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-700">Maintenance Costs: </span>
              <span className="text-sm text-gray-900 font-medium">
                {formatCurrency(maintenanceCosts.fiveYear.min)} - {formatCurrency(maintenanceCosts.fiveYear.max)}
              </span>
            </div>
          )}
          {anticipatedRepairs?.fiveYear && anticipatedRepairs.fiveYear.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700">Anticipated Repairs:</span>
              <ul className="list-disc list-inside mt-1 text-sm text-gray-600">
                {anticipatedRepairs.fiveYear.map((repair, index) => (
                  <li key={index} className="leading-relaxed">{repair}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 10-Year Projections */}
      {(maintenanceCosts?.tenYear || anticipatedRepairs?.tenYear) && (
        <div>
          <h5 className="font-semibold text-gray-900 mb-2 text-sm">10-Year Projections</h5>
          {maintenanceCosts?.tenYear && (
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-700">Maintenance Costs: </span>
              <span className="text-sm text-gray-900 font-medium">
                {formatCurrency(maintenanceCosts.tenYear.min)} - {formatCurrency(maintenanceCosts.tenYear.max)}
              </span>
            </div>
          )}
          {anticipatedRepairs?.tenYear && anticipatedRepairs.tenYear.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700">Anticipated Repairs:</span>
              <ul className="list-disc list-inside mt-1 text-sm text-gray-600">
                {anticipatedRepairs.tenYear.map((repair, index) => (
                  <li key={index} className="leading-relaxed">{repair}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SystemDetails;
