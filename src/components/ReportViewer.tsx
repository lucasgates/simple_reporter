import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SecurityReport from './SecurityReport';
import { ReportData } from './SecurityReport';
import { ArrowLeft, Loader2 } from 'lucide-react';

function ReportViewer() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        if (!reportId) {
          setError('Report ID is missing');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/reports/${reportId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Report not found. The link may be invalid or expired.');
          } else {
            setError('Failed to load report. Please try again later.');
          }
          setLoading(false);
          return;
        }

        const result = await response.json();
        
        if (result.success && result.report) {
          setReportData(result.report.data);
        } else {
          setError('Invalid report data received');
        }
      } catch (err) {
        console.error('Error fetching report:', err);
        setError('An error occurred while loading the report');
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [reportId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-300 text-lg">Carregando relatório...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Erro</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
        </div>
      </div>
    );
  }

  return reportData ? <SecurityReport data={reportData} /> : null;
}

export default ReportViewer;