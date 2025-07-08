
import React from 'react';
import { useParams, Navigate, Outlet } from 'react-router-dom';
import { SharedReportProvider } from '@/contexts/SharedReportContext';
import SharedReportLayout from '@/components/SharedReportLayout';

const SharedReport = () => {
  const { token } = useParams<{ token: string }>();

  if (!token) {
    return <Navigate to="/404" replace />;
  }

  return (
    <SharedReportProvider token={token}>
      <SharedReportLayout>
        <Outlet />
      </SharedReportLayout>
    </SharedReportProvider>
  );
};

export default SharedReport;
